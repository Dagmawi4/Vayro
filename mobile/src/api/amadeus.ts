// src/api/amadeus.ts
import { AMADEUS_API_KEY, AMADEUS_API_SECRET } from "@env";

const AMADEUS_BASE_URL = "https://test.api.amadeus.com";
const API_KEY = AMADEUS_API_KEY;
const API_SECRET = AMADEUS_API_SECRET;

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

// ✅ Step 1: Get access token
async function getAccessToken() {
  // If we already have a token and it’s still valid, reuse it
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`,
  });

  if (!response.ok) {
    throw new Error("❌ Failed to get Amadeus token");
  }

  const data = await response.json();
  accessToken = data.access_token;
  // Save expiry with 1-minute buffer
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return accessToken;
}

export { getAccessToken };

// ✅ Step 2: Flight search
export async function searchFlights({
  origin,
  destination,
  departureDate,
  returnDate,
  adults,
  maxPrice,
}: {
  origin: string;          // IATA code (e.g., JFK, LHR)
  destination: string;     // IATA code
  departureDate: string;   // YYYY-MM-DD
  returnDate?: string;     // YYYY-MM-DD (optional)
  adults: number;
  maxPrice?: number;
}) {
  const token = await getAccessToken();

  let url = `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}`;

  if (returnDate) url += `&returnDate=${returnDate}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`❌ Failed to fetch flights: ${errText}`);
  }

  const data = await response.json();
  return data;
}

