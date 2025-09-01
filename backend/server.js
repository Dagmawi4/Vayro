const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const OpenAI = require("openai");
const axios = require("axios");
require("dotenv").config(); // load secrets from backend/.env

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* -------------------- HEALTH -------------------- */
app.get("/api/health", (req, res) => res.json({ ok: true }));

/* -------------------- TRIP PLAN -------------------- */
const dayjs = require("dayjs");

app.post("/api/trips/plan", async (req, res) => {
  try {
    const {
      departCity,
      departCountry,
      destCity,
      destCountry,
      mode,
      duration,
      budget, // treated as TOTAL trip budget
      mood,
      food,
      activities,
      travelSolo,
      commitments, // array of commitments
      visitedBefore,
      tripDates,
      groupSize,
    } = req.body;

    /* ---- 1. Fetch real places from Google Places ---- */
    async function fetchPlaces(query) {
      try {
        const resp = await axios.get(
          "https://maps.googleapis.com/maps/api/place/textsearch/json",
          {
            params: {
              query,
              location: destCity,
              radius: 12000,
              key: process.env.GOOGLE_PLACES_API_KEY,
            },
          }
        );

        // Fetch details for each place to get website + phone
        const placesWithDetails = await Promise.all(
          resp.data.results.map(async (p) => {
            let website = "No website available";
            let phone = "No phone number available";

            try {
              const detailsResp = await axios.get(
                "https://maps.googleapis.com/maps/api/place/details/json",
                {
                  params: {
                    place_id: p.place_id,
                    fields: "website,formatted_phone_number",
                    key: process.env.GOOGLE_PLACES_API_KEY,
                  },
                }
              );

              const details = detailsResp.data.result;
              if (details.website) {
                website = details.website;
              }
              if (details.formatted_phone_number) {
                phone = details.formatted_phone_number;
              }
            } catch (err) {
              console.warn("Details fetch failed for", p.name, err.message);
            }

            return {
              name: p.name,
              address: p.formatted_address || "N/A",
              rating: p.rating || "N/A",
              priceRange: mapPriceLevel(p.price_level),
              placeId: p.place_id,
              website,
              phone,
            };
          })
        );

        return placesWithDetails;
      } catch (err) {
        console.error("Google Places error:", err.message);
        return [];
      }
    }

    // Convert Google price_level into ranges
    function mapPriceLevel(level) {
      switch (level) {
        case 0: return "Free";
        case 1: return "$ (Under $10)";
        case 2: return "$$ ($10–30)";
        case 3: return "$$$ ($30–60)";
        case 4: return "$$$$ ($60+)";
        default: return "N/A";
      }
    }

    // Estimate numeric values from priceRange
    function estimatePrice(priceRange) {
      switch (priceRange) {
        case "Free": return 0;
        case "$ (Under $10)": return 10;
        case "$$ ($10–30)": return 20;
        case "$$$ ($30–60)": return 45;
        case "$$$$ ($60+)": return 80;
        default: return 20; // fallback average
      }
    }

    // Fetch bigger pools for variety
    const restaurants = await fetchPlaces(`${food || ""} restaurants in ${destCity}`);
    const attractions = await fetchPlaces(`${mood || "tourist"} attractions in ${destCity}`);
    const malls = await fetchPlaces(`shopping malls in ${destCity}`);
    const unique = await fetchPlaces(`unique things to do in ${destCity}`);
    const parks = await fetchPlaces(`parks and outdoor activities in ${destCity}`);

    /* ---- 2. Map tripDates → weekdays for commitments ---- */
    const formattedDates = Array.isArray(tripDates)
      ? tripDates.map((d) => ({
          date: d,
          label: dayjs(d).format("dddd, MMM D, YYYY"),
          weekday: dayjs(d).format("dddd"),
        }))
      : [];

    const startDate = formattedDates.length > 0 ? formattedDates[0].date : null;
    const formattedStart = startDate
      ? dayjs(startDate).format("dddd, MMM D, YYYY")
      : "Day 1";

    /* ---- 3. Build prompt for GPT ---- */
    const prompt = `
You are a professional travel planner.
Create a detailed ${duration}-day itinerary for ${destCity}, ${destCountry}.
The user will wake up in the city each day and needs a full-day plan.

User details: 
- Total Budget: ${budget} 
- Mood: ${mood} 
- Food preferences: ${food} 
- Activities: ${activities} 
- Travel solo: ${travelSolo} 
- Group size: ${groupSize || "N/A"} 
- Commitments: ${JSON.stringify(commitments || [])} 
- Visited before: ${visitedBefore} 
- Trip dates: ${JSON.stringify(formattedDates)}

RULES:
- Respond with VALID JSON ONLY, no explanations.
- Day 1 MUST start on ${formattedStart} with the correct weekday and date.
- Continue sequentially, using actual weekdays/dates (not "Day 1, Day 2").
- Each day must include at least 6–8 activities.
- At least two activity per day must be a famous or must-see landmark of ${destCity}
- Place each commitment ONLY on its exact specified date and time. Do not duplicate across other days.
- Schema:
[
  {
    "day": "Thursday, Sep 11, 2025",
    "schedule": [
      {
        "time": "09:00 AM",
        "options": [
          {
            "name": "Place Name",
            "description": "Engaging 2–3 sentences about why this place is recommended.",
            "type": "restaurant | attraction | activity | shopping | outdoor | commitment",
            "priceRange": "Free | $ (Under $10) | $$ ($10–30) | $$$ ($30–60) | $$$$ ($60+) | N/A",
            "address": "Full address or N/A",
            "hours": "Opening and closing hours or N/A",
            "parking": "Parking info or N/A",
            "website": "Official website or 'No website available'",
            "phone": "Official phone or 'No phone number available'"
          }
        ]
      }
    ]
  }
]

- Assign realistic times (breakfast ~8–9 AM, lunch ~12–1 PM, afternoon ~2–4 PM, dinner ~6–7 PM, evening ~8–10 PM).
- Provide exactly 2 top restaurants per eating time (breakfast, lunch, dinner)
- Recommend plenty of different activities — don’t be afraid to fill the day and give upto 6 - 7 activities each day.
- Prioritize iconic attractions and then fill with secondary activities.
- ⚠️ DO NOT repeat the same restaurant or activity across different days.
- Respect the total budget of ${budget}.
- Respect dietary restrictions (restaurants).
- Respect group size (e.g. family-friendly, romantic for couples, solo activities).
- ⚠️ Every commitment from this list must appear as its own schedule entry and only on the correct day and time:
  ${JSON.stringify(commitments || [])}
  - Use "type": "commitment"
  - Description: "This is a fixed commitment. No activities should overlap with this time."
- Activities must align with mood (${mood}) and preferences (${activities}).
- Choose ONLY from these real options (expand descriptions but do not invent new places):

Restaurants: ${JSON.stringify(restaurants.slice(0, 25))}
Attractions: ${JSON.stringify(attractions.slice(0, 25))}
Shopping: ${JSON.stringify(malls.slice(0, 10))}
Unique: ${JSON.stringify(unique.slice(0, 10))}
Outdoor: ${JSON.stringify(parks.slice(0, 10))}
    `;

    /* ---- 4. Call OpenAI ---- */
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    let plan = response.choices[0].message?.content?.trim() || "";
    plan = plan.replace(/```json/g, "").replace(/```/g, "").trim();

    /* ---- 5. Calculate Budget Summary ---- */
    let parsedPlan;
    let budgetSummary = {};
    let totalEstimate = 0;

    try {
      parsedPlan = JSON.parse(plan);

      const dailyBudget = budget / duration; // per-day budget from total

      parsedPlan.forEach((day) => {
        let dayEstimate = 0;
        day.schedule.forEach((slot) => {
          if (slot.options && slot.options.length > 0) {
            const avg = estimatePrice(slot.options[0].priceRange);
            dayEstimate += avg;
          }
        });
        totalEstimate += dayEstimate;

        budgetSummary[day.day] = {
          estimated: dayEstimate,
          budget: dailyBudget,
          status:
            dayEstimate <= dailyBudget
              ? `✅ Within budget`
              : `⚠️ Over budget by $${dayEstimate - dailyBudget}`,
        };
      });

      budgetSummary["total"] = {
        estimated: totalEstimate,
        budget: budget,
        status:
          totalEstimate <= budget
            ? `✅ Within total budget`
            : `⚠️ Over budget by $${totalEstimate - budget}`,
      };
    } catch (err) {
      console.error("Budget calculation error:", err.message);
    }

    /* ---- 6. Send response ---- */
    res.json({ plan, budgetSummary });
  } catch (err) {
    console.error("Trip plan error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: "Trip generation failed",
      details: err.response?.data || err.message,
    });
  }
});




/* -------------------- AMADEUS TOKEN (PRODUCTION ONLY) -------------------- */
async function getAmadeusToken() {
  const baseUrl = "https://api.amadeus.com"; // ✅ always production
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  const res = await axios.post(
    `${baseUrl}/v1/security/oauth2/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    })
  );

  return { token: res.data.access_token, baseUrl };
}

/* -------------------- AIRPORT AUTOCOMPLETE -------------------- */
app.get("/api/airports/search", async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: "Keyword required" });

    const { token, baseUrl } = await getAmadeusToken();
    const amadeusRes = await axios.get(
      `${baseUrl}/v1/reference-data/locations`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { keyword, subType: "AIRPORT" },
      }
    );

    const airports = amadeusRes.data.data.map((a) => ({
      id: a.id,
      name: a.name,
      iataCode: a.iataCode,
      city: a.address?.cityName,
      country: a.address?.countryName,
    }));

    res.json({ airports });
  } catch (err) {
    console.error("Airport search error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: "Airport search failed" });
  }
});

/* -------------------- FLIGHTS -------------------- */
app.post("/api/flights/search", async (req, res) => {
  try {
    const {
      departure,
      destination,
      departureDate,
      returnDate,
      passengers,
      budget,
      allowLayover,
    } = req.body;

    const { token, baseUrl } = await getAmadeusToken();
    const amadeusRes = await axios.get(`${baseUrl}/v2/shopping/flight-offers`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        originLocationCode: departure,
        destinationLocationCode: destination,
        departureDate: departureDate?.split("T")[0],
        returnDate: returnDate?.split("T")[0],
        adults: passengers,
        maxPrice: budget || undefined,
        nonStop: !allowLayover,
        currencyCode: "USD",
        max: 5,
      },
    });

    const flights = amadeusRes.data.data || [];
    const flightData = flights.map((f) => ({
      from: f.itineraries[0].segments[0].departure.iataCode,
      to: f.itineraries[0].segments.at(-1).arrival.iataCode,
      price: f.price.total,
      airline: f.validatingAirlineCodes[0],
    }));

    const prompt = `
Summarize these flights professionally:

Flights: ${JSON.stringify(flightData)}

Include:
1. Flight Search Summary
2. Comparison of Options (cheapest, fastest, assessment)
3. Recommendations

Style: business-professional. No hashtags, no markdown headers. Use plain text with bullet points if needed.
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ flights, aiSummary: aiRes.choices[0].message?.content?.trim() });
  } catch (err) {
    console.error("Flight search error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: "Flight search failed" });
  }
});

/* -------------------- GOOGLE PLACES -------------------- */
app.get("/api/places/autocomplete", async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) return res.status(400).json({ error: "Input required" });

    const googleRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input,
          key: process.env.GOOGLE_PLACES_API_KEY,
          types: "geocode",
        },
      }
    );

    res.json({ predictions: googleRes.data.predictions });
  } catch (err) {
    console.error("Places error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: "Places failed" });
  }
});

/* -------------------- TRANSPORT OPTIONS -------------------- */
app.post("/api/transport/options", async (req, res) => {
  try {
    const { mode, airport, airportCity, airportCountry, destination, undecided } = req.body;

    // Geocode helper
    async function geocode(place) {
      const geo = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: { address: place, key: process.env.GOOGLE_GEOCODING_API_KEY },
      });
      return geo.data.results?.[0]?.geometry?.location || null;
    }

    const originLoc = await geocode(airportCity || airport);
    const destLoc =
      !undecided && destination && destination !== "Undecided"
        ? await geocode(destination)
        : null;

    let distanceMiles = null,
      durationMins = null;
    if (originLoc && destLoc) {
      const dm = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
        params: {
          origins: `${originLoc.lat},${originLoc.lng}`,
          destinations: `${destLoc.lat},${destLoc.lng}`,
          key: process.env.GOOGLE_DISTANCE_MATRIX_API_KEY,
        },
      });

      if (dm.data?.rows?.[0]?.elements?.[0]?.status === "OK") {
        const elem = dm.data.rows[0].elements[0];
        distanceMiles = elem.distance.value / 1609.34;
        durationMins = elem.duration.value / 60;
      }
    }

    // Approximate Uber/Lyft fares
    let uberEst = null,
      lyftEst = null;
    if (distanceMiles) {
      uberEst = 2.5 + 1.75 * distanceMiles;
      lyftEst = 2.0 + 1.6 * distanceMiles;
    }

    // GPT Prompt
    const prompt = `
You are Vayro, a professional AI travel assistant.
Generate JSON for transport option: ${mode}.

Context:
- Airport: ${airport} (${airportCity}, ${airportCountry})
- Destination: ${undecided ? "Undecided (default downtown)" : destination}
- Distance: ${distanceMiles ? distanceMiles.toFixed(1) + " miles" : "Unknown"}
- Duration: ${durationMins ? durationMins.toFixed(0) + " minutes" : "Unknown"}
- Uber est: ${uberEst ? "$" + uberEst.toFixed(2) : "N/A"}
- Lyft est: ${lyftEst ? "$" + lyftEst.toFixed(2) : "N/A"}

Requirements:
- Always return valid JSON: { "title": string, "details": string[] }
- No markdown, no asterisks, no hashtags.
- Title must match the mode label:
   • Uber/Lyft → "Uber / Lyft"
   • Shuttle → "Shuttle"
   • Rental → "Car Rental"
   • Friend → "Friend / Family Pickup"
- details[] must contain 5–6 professional, passenger-focused bullet points.
- Each should mention airport and destination explicitly.
- Examples:
   • Uber/Lyft: "From ${airportCity} Airport to ${destination}, Uber fare is X, Lyft is Y. Pickup at Terminal B, Door 5."
   • Shuttle: pickup zone, frequency, hours of operation, mention if too far for shuttle suggest bus services.
   • Car Rental: rental center location, companies, average prices, requirements.
   • Friend/Family: instructions for passenger — baggage claim, exit doors, meeting point, short-term parking, cell phone lot.
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = aiRes.choices[0].message?.content?.trim();
    if (content.startsWith("```")) {
      content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    const parsed = JSON.parse(content);
    res.json(parsed);
  } catch (err) {
    console.error("Transport options error:", err.response?.data || err.message);
    res.status(500).json({ error: "Transport options failed" });
  }
});

/* -------------------- VIRA CHAT -------------------- */
const conversations = {};

app.post("/api/vira/chat", async (req, res) => {
  try {
    const { convoId, message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // Create new convo if missing
    if (!conversations[convoId]) {
      conversations[convoId] = [];
    }

    // Push user message
    conversations[convoId].push({ role: "user", content: message });

    // Call OpenAI
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: `You are Vira, a friendly travel companion inside the Vayro app.
Respond naturally, with warmth and detail.
Formatting rules:
- Use **bold** for titles or key points
- Use bullet points for lists
- Use line breaks for readability
- Do not use hashtags or asterisk styling
- Keep it professional, clear, and approachable.`,
        },
        ...conversations[convoId],
      ],
    });

    const reply =
      aiRes.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I didn’t catch that.";

    // Save AI reply
    conversations[convoId].push({ role: "assistant", content: reply });

    return res.json({ reply });
  } catch (err) {
    console.error(
      "Vira chat error:",
      err.response?.data || err.message || err
    );
    return res.status(500).json({
      error: "Chat request failed",
      details: err.response?.data || err.message || err,
    });
  }
});


/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
