// src/screens/TripPlanScreen.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  View,
  Pressable,
  Linking,
  LayoutAnimation,
  UIManager,
  Platform,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { OPENAI_API_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

// enable expand animation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, "TripPlan">;

interface Place {
  name: string;
  description: string;
  hours?: string;
  parking?: string;
  bookingLink?: string;
  address?: string;
}

interface DayPlan {
  day: string;
  morning: Place[];
  afternoon: Place[];
  evening: Place[];
}

export default function TripPlanScreen({ route, navigation }: Props) {
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
  } = route.params;

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({});

  const fetchItinerary = async () => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a professional travel assistant. 
Return the trip plan STRICTLY in JSON format, no markdown, no prose.
Schema:
[
  {
    "day": "Day 1 - Monday, Jan 1",
    "morning": [
      { "name": "Place", "description": "Details", "hours": "9 AM - 5 PM", "parking": "Nearby garage", "bookingLink": "https://...", "address": "123 Main St" }
    ],
    "afternoon": [ { ... } ],
    "evening": [ { ... } ]
  }
]

Guidelines:
- For ${destCity}, ${destCountry}, give at least 3 detailed recommendations per slot (morning, afternoon, evening).
- Each place must include: description (what/why), address, ⏰ hours, 🚗 parking info if relevant, and 🔗 booking link if available.
- Prioritize iconic landmarks, must-try food spots, and local unique experiences.
- Make descriptions engaging and detailed (2-3 sentences).
- Ensure valid JSON only.`
            },
            {
              role: "user",
              content: `Plan a ${duration}-day trip to ${destCity}, ${destCountry}.
Mode: ${mode === "car" ? "Car trip" : `Flight from ${departCity}, ${departCountry}`}
Budget: ${budget}
Mood: ${mood}
Food preferences: ${food}
Activities: ${activities}
Travel style: ${travelSolo}
Commitments: ${Array.isArray(commitments) && commitments.length ? commitments.join(", ") : "None"}
Visited before: ${Array.isArray(visitedBefore) && visitedBefore.length ? visitedBefore.join(", ") : "No"}
Trip dates: ${Array.isArray(tripDates) && tripDates.length ? tripDates.join(" to ") : "Flexible"}

Return JSON only.`
            }
          ],
          temperature: 0.85,
        }),
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim();

      try {
        const parsed = JSON.parse(text);
        setPlan(parsed);
      } catch (e) {
        console.error("JSON parse error:", e, text);
        setPlan([]);
      }
    } catch (error) {
      console.error(error);
      setPlan([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, []);

  const toggleDay = (day: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSaveTrip = async () => {
    try {
      const savedTripsRaw = await AsyncStorage.getItem("savedTrips");
      const savedTrips = savedTripsRaw ? JSON.parse(savedTripsRaw) : [];
      const newTrip = {
        id: Date.now(),
        destCity,
        destCountry,
        duration,
        tripDates,
        plan,
      };
      await AsyncStorage.setItem("savedTrips", JSON.stringify([...savedTrips, newTrip]));
      Alert.alert("✅ Saved", "This trip was saved to your Trips page.");
      navigation.navigate("Trips");
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error", "Could not save trip.");
    }
  };

  const openMaps = (address: string) => {
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?q=${encodeURIComponent(address)}`
        : `geo:0,0?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const renderPlaces = (places: Place[]) => {
    return places.map((place, idx) => (
      <View key={idx} style={styles.placeCard}>
        <Text style={styles.placeName}>📍 {place.name}</Text>
        <Text style={styles.placeDesc}>{place.description}</Text>
        {place.hours && <Text style={styles.meta}>⏰ {place.hours}</Text>}
        {place.parking && <Text style={styles.meta}>🚗 {place.parking}</Text>}
        {place.bookingLink && (
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(place.bookingLink!)}
          >
            🔗 Book / Info
          </Text>
        )}
        {place.address && (
          <Text
            style={styles.link}
            onPress={() => openMaps(place.address!)}
          >
            🗺️ Directions
          </Text>
        )}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{destCity}, {destCountry}</Text>
          <Text style={styles.heroSub}>
            {duration} days · {Array.isArray(tripDates) ? tripDates.join(" - ") : "Flexible"}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Generating itinerary...</Text>
          </View>
        ) : (
          <>
            {plan.map((day, idx) => {
              const isOpen = expandedDays[day.day];
              return (
                <View key={idx} style={styles.dayCard}>
                  <Pressable onPress={() => toggleDay(day.day)} style={styles.dayHeader}>
                    <Text style={styles.dayTitle}>{day.day}</Text>
                    <Text style={styles.toggle}>{isOpen ? "−" : "+"}</Text>
                  </Pressable>
                  {isOpen && (
                    <View style={styles.dayContent}>
                      {day.morning?.length > 0 && (
                        <>
                          <Text style={styles.section}>🌞 Morning</Text>
                          {renderPlaces(day.morning)}
                        </>
                      )}
                      {day.afternoon?.length > 0 && (
                        <>
                          <Text style={styles.section}>🌆 Afternoon</Text>
                          {renderPlaces(day.afternoon)}
                        </>
                      )}
                      {day.evening?.length > 0 && (
                        <>
                          <Text style={styles.section}>🌙 Evening</Text>
                          {renderPlaces(day.evening)}
                        </>
                      )}
                    </View>
                  )}
                </View>
              );
            })}

            {/* Save Trip Button */}
            <Pressable style={styles.saveButton} onPress={handleSaveTrip}>
              <Text style={styles.saveText}>❤️ Save This Trip</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16 },
  heroCard: {
    backgroundColor: "#2563eb",
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: "center",
  },
  heroTitle: { fontSize: 24, fontWeight: "700", color: "#fff" },
  heroSub: { fontSize: 16, color: "#e0e7ff", marginTop: 4 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  loadingText: { marginTop: 10, fontSize: 16, color: "#6b7280" },

  dayCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    backgroundColor: "#f9fafb",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#2563eb",
  },
  dayTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  toggle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  dayContent: { padding: 14 },
  section: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 6, color: "#111" },

  placeCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  placeName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  placeDesc: { fontSize: 14, color: "#555", marginBottom: 6 },
  meta: { fontSize: 13, color: "#444", marginBottom: 4 },
  link: { fontSize: 14, color: "#2563eb", textDecorationLine: "underline", marginTop: 4 },

  saveButton: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});







