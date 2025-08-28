# 📐 Vayro Architecture

This document provides a high-level overview of **Vayro’s mobile architecture**, showing how the **React Native frontend**, **Node.js backend**, **data services**, and **third-party APIs** interact to deliver an AI-powered, end-to-end travel planning experience.

---

## 1. Components

### 1.1 Mobile Frontend (React Native + Expo)

* **Framework**: React Native (Expo managed workflow)  
* **Navigation**: React Navigation (Stack + Bottom Tabs)  
* **Screens**:
  - `Auth` → Login / Signup flow
  - `Home` → Recommendations, moods, quick picks
  - `Flights` → Flight search (Amadeus + AI summary)
  - `Trips` → AI itinerary generation
  - `Profile` → User info, settings, preferences
  - `Vira Chat` → AI assistant for travel/general queries
* **State Management**: React Hooks + AsyncStorage (for lightweight persistence)
* **Styling**: React Native Stylesheet, with modern UI patterns

---

### 1.2 Backend (Node.js + Express)

* **Server**: Express app (`backend/server.js`)
* **Routes**:
  - **`/api/auth`** → placeholder for login/signup (future Firebase/Supabase integration)
  - **`/api/transport/estimate-price`** → returns Uber/Lyft mock estimates
  - **`/api/trips/plan`** → generates daily trip plan via OpenAI
  - **`/api/flights/search`** → Amadeus flight offers + AI summary
  - **`/api/vira/chat`** → general-purpose chat endpoint powered by OpenAI
* **Middleware**: CORS, JSON parsing, logging (Morgan)

---

### 1.3 Database & Authentication (Planned)

* **Auth**: Firebase Auth or Supabase Auth  
* **Database**: Firestore or Supabase for user profiles, preferences, and trips  
* **Security**: Per-user rules to ensure only logged-in users access their data  

(Current MVP uses in-memory + AsyncStorage; persistent DB coming in next phase.)

---

### 1.4 Third-Party APIs

* **OpenAI GPT-4** → Powers trip generation, flight summaries, and **Vira AI assistant**  
* **Amadeus API** → Real-time flight search and pricing  
* **Uber/Lyft (mock, future live)** → Transport price estimates and pickups  
* **Google Maps API** → Geocoding, directions, distance/time  
* **Yelp / Foursquare API** → Restaurants, ratings, top dishes  
* **Viator / Booking APIs** → Activities & reservations  

---

## 2. Data Flow Diagram

```text
          ┌──────────────────────┐
          │   React Native App   │
          │  (Expo, iOS/Android) │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   Express API Server │
          │  (backend/server.js) │
          └──────────┬───────────┘
                     │
   ┌─────────────────┼─────────────────┐
   ▼                 ▼                 ▼
Firebase/Supabase   OpenAI GPT-4     Amadeus API
(Auth + DB)         (Trips, Vira)    (Flights)

       ▼                 ▼                 ▼
 Google Maps API     Yelp/Foursquare     Uber/Lyft APIs
 (Routes, ETA)       (Food, Reviews)     (Transport est.)


