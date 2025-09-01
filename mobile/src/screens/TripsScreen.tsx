// src/screens/TripsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function TripsScreen({ navigation }) {
  const [trips, setTrips] = useState<any[]>([]);

  // Load trips from AsyncStorage
  const loadTrips = async () => {
    try {
      const savedTripsRaw = await AsyncStorage.getItem("savedTrips");
      const savedTrips = savedTripsRaw ? JSON.parse(savedTripsRaw) : [];
      setTrips(savedTrips);
    } catch (error) {
      console.error("Failed to load trips:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadTrips);
    return unsubscribe;
  }, [navigation]);

  // Delete a trip
  const deleteTrip = async (id: number) => {
    try {
      const updatedTrips = trips.filter((t) => t.id !== id);
      setTrips(updatedTrips);
      await AsyncStorage.setItem("savedTrips", JSON.stringify(updatedTrips));
      if (updatedTrips.length === 0) {
        Alert.alert("Trip deleted", "No trips planned yet.");
      }
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  // Open a saved trip
  const openTrip = (trip: any) => {
    navigation.navigate("SavedTripDetails", trip);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Trips ✈️</Text>
      </View>

      {trips.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🗺️</Text>
          <Text style={styles.emptyTitle}>No trips planned yet</Text>
          <Text style={styles.emptySubtitle}>
            Start your journey by adding your first trip.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.tripList}>
          {trips.map((trip, index) => (
            <View key={index} style={styles.tripCard}>
              {/* Tap to open full trip details */}
              <TouchableOpacity style={{ flex: 1 }} onPress={() => openTrip(trip)}>
                <Text style={styles.tripCity}>
                  {trip.destCity}
                  {trip.destCountry ? `, ${trip.destCountry}` : ""}
                </Text>
                <Text style={styles.tripDates}>
                  {Array.isArray(trip.tripDates)
                    ? `${trip.tripDates[0]} - ${
                        trip.tripDates[trip.tripDates.length - 1]
                      }`
                    : trip.tripDates}
                </Text>
                <Text style={styles.tripDuration}>{trip.duration} days</Text>

                {/* Show trip-wide budget status */}
                {trip.budgetSummary?.total && (
                  <Text
                    style={[
                      styles.budgetStatus,
                      trip.budgetSummary.total.status.includes("⚠️")
                        ? { color: "red" }
                        : { color: "green" },
                    ]}
                  >
                    {trip.budgetSummary.total.status}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Delete button */}
              <TouchableOpacity onPress={() => deleteTrip(trip.id)}>
                <Ionicons name="trash" size={22} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Floating + button (always visible) */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("AddTrip")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },
  title: { fontSize: 22, fontWeight: "700" },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "600", marginBottom: 6 },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },

  tripList: { padding: 20 },
  tripCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tripCity: { fontSize: 18, fontWeight: "600" },
  tripDates: { fontSize: 14, color: "#6b7280" },
  tripDuration: { fontSize: 14, color: "#2563eb", fontWeight: "500" },
  budgetStatus: { fontSize: 14, marginTop: 4, fontWeight: "600" },

  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2563eb",
    borderRadius: 30,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
});


