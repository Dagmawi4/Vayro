const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const OpenAI = require("openai");
const axios = require("axios");
require("dotenv").config(); // ✅ load secrets from backend/.env

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ✅ Mock price estimates
app.get("/api/transport/estimate-price", (req, res) => {
  res.json({ uber: 24.12, lyft: 21.87 });
});

// 🆕 Trip Plan generation
app.post("/api/trips/plan", async (req, res) => {
  try {
    const {
      departCity,
      departCountry,
      destCity,
      destCountry,
      mode,
      duration,
      budget,
      mood,
      food,
      activities,
      travelSolo,
      commitments,
      visitedBefore,
      tripDates,
    } = req.body;

    const prompt = `
You are a professional travel assistant. Return the trip plan STRICTLY in JSON format.

Schema:
[
  {
    "day": "Day 1 - Monday, Jan 1",
    "morning": [ { "name": "Place", "description": "Details", "hours": "...", "parking": "...", "bookingLink": "https://...", "address": "..." } ],
    "afternoon": [ { ... } ],
    "evening": [ { ... } ]
  }
]

Guidelines:
- For ${destCity}, ${destCountry}, give at least 3 recommendations per slot (morning, afternoon, evening).
- Each place must include: description, address, hours, parking, booking link if available.
- Make descriptions engaging and 2–3 sentences.
- Ensure valid JSON only.

Trip details: ${duration} days, Mode: ${mode}, Budget: ${budget}, Mood: ${mood}, Food: ${food}, Activities: ${activities}, Travel: ${travelSolo}, Commitments: ${commitments}, Visited: ${visitedBefore}, Dates: ${tripDates}.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
    });

    let plan = response.choices[0].message?.content?.trim() || "";

    // ✅ Clean out markdown fences if present
    plan = plan.replace(/```json/g, "").replace(/```/g, "").trim();

    res.json({ plan });
  } catch (err) {
    console.error("Trip plan error:", err.response?.data || err.message);
    res.status(500).json({ error: "Trip generation failed" });
  }
});

// 🔎 Helper: Amadeus token fetch
async function getAmadeusToken() {
  const res = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    })
  );
  return res.data.access_token;
}

// 🆕 Flight Search + AI summary
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

    // 1️⃣ Amadeus access token
    const token = await getAmadeusToken();

    // 2️⃣ Flight offers
    const amadeusRes = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          originLocationCode: departure,
          destinationLocationCode: destination,
          departureDate: departureDate ? departureDate.split("T")[0] : undefined,
          returnDate: returnDate ? returnDate.split("T")[0] : undefined,
          adults: passengers,
          maxPrice: budget || undefined,
          nonStop: !allowLayover, // ✅ simpler + clearer
          currencyCode: "USD",
          max: 5, // limit results
        },
      }
    );

    const flights = amadeusRes.data.data || [];

    // 3️⃣ Summarize with OpenAI
    const flightData = flights.map((f) => ({
      from: f.itineraries[0].segments[0].departure.iataCode,
      to: f.itineraries[0].segments[f.itineraries[0].segments.length - 1].arrival.iataCode,
      price: f.price.total,
      airline: f.validatingAirlineCodes[0],
    }));

    const prompt = `
You are a professional travel assistant. Based on this flight search:
- Route: ${departure} → ${destination}
- Passengers: ${passengers}
- Budget: ${budget || "not specified"}

Flights Data: ${JSON.stringify(flightData)}

Generate a structured, professional recommendation with these sections:

1. **Flight Search Summary**
   - Route, Dates, Airlines, Prices, Number of Options

2. **Comparison of Options**
   - Cheapest Flight
   - Fastest Flight
   - Overall Assessment

3. **Recommendations**
   - 2–3 concise, practical travel tips (e.g. book early, check layovers, consider flexibility).

⚠️ Important:
- Write in clear, business-professional language.
- Avoid hashtags, markdown headers (###), or casual tone.
- Use plain bullet points and line breaks for readability.
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let aiSummary = aiRes.choices[0].message?.content?.trim() || "";

    res.json({ flights, aiSummary });
  } catch (err) {
    console.error(
      "Flight search error:",
      err.response?.status,
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Flight search failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`API running on http://localhost:${PORT}`)
);

