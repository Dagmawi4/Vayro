# Vayro Architecture

This document provides a high-level overview of Vayro’s system architecture, illustrating how the frontend, backend, database/auth services, and third-party APIs interact to deliver seamless, end-to-end travel planning.

---

## 1. Components

### 1.1 Frontend (Next.js + Tailwind CSS)

* **Hosting/Rendering**: Vercel, with hybrid SSR/CSR for performance.
* **Pages & Routes**:

  * `/login`: Email/password authentication UI
  * `/dashboard`: User homepage showing saved/upcoming trips
  * `/airport`: Airport → transport flow (price estimates)
  * `/trip`: Trip customization & plan generation
* **State Management**: React Context or built‑in Next.js data fetching hooks
* **UI Library**: Tailwind CSS for styling, custom components (e.g., `TransportSelector`, `ItineraryCard`)

### 1.2 Backend (Node.js + Express)

* **Server**: Express app (in `backend/server.js`)
* **Routes** (`backend/routes/`):

  * **`/api/auth`**: placeholder for login/logout (to be replaced by Firebase triggers)
  * **`/api/transport/estimate-price`**: GET stub returning Uber/Lyft mock estimates
  * **`/api/itinerary/plan-trip`**: POST stub invoking OpenAI to generate a daily plan
* **Middleware**: JSON parsing, CORS, logging

### 1.3 Database & Authentication

* **Auth**: Firebase Auth (Email/Password, future OAuth providers)
* **Database**: Firestore (or Supabase) to store user profiles, preferences, and trip data
* **Security**: Firestore rules or Supabase policies enforcing per-user access

### 1.4 Third-Party APIs

* **OpenAI GPT-4 API**: Generates the itinerary based on user inputs (mood, duration, activities)
* **Google Maps API**: Geocoding, directions, distance matrix
* **Uber & Lyft APIs**: Real-time ride price estimates & airport pickup locations
* **Yelp (or Foursquare) API**: Restaurant data, ratings, top dishes
* **Activity Booking APIs** (e.g., Viator): Real-time availability and booking links

---

## 2. Data Flow Diagram

```text
                ┌─────────────────────┐
                │  Mobile/Web Client  │
                └─────────┬───────────┘
                          │
                          ▼
                ┌─────────────────────┐
                │    Next.js Frontend │
                └─────────┬───────────┘
                          │
                client  │ │  server
               interaction│  rendering/data-fetch
                          ▼
                ┌─────────────────────┐            ┌──────────────────────────┐
                │  Express API Server │◀──────────▶│  Firebase Auth & DB     │
                │  (backend/server.js)│            │  (Auth + Firestore)     │
                └─────────┬───────────┘            └──────────────────────────┘
                          │
         Route handlers   │
   estimate-price / plan-trip
                          ▼
    ┌─────────────────────────────────────────────────────┐
    │              Third-Party Services                 │
    │  • OpenAI GPT-4              • Google Maps         │
    │  • Uber/Lyft APIs            • Yelp/Foursquare     │
    │  • Activity Booking APIs                          │
    └─────────────────────────────────────────────────────┘
```

---

## 3. Deployment & CI/CD

* **Frontend**: Auto-deploy on push to `main` via Vercel
* **Backend**: Deploy Express server on a managed Node.js platform (e.g., Heroku, DigitalOcean App Platform)
* **Environment Variables**: Stored securely (OpenAI key, Firebase config, API keys)
* **Testing**: Unit tests for each route; end-to-end tests for core flows with Playwright or Cypress

---

## 4. Future Enhancements

* GraphQL layer to consolidate data fetching
* WebSockets for real-time notifications (e.g., ride arrival alerts)
* Microservices split: separate pricing & itinerary-generation services
