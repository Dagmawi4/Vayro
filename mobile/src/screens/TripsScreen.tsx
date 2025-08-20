import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";

export default function TripsScreen({ navigation }) {
  // For MVP → start empty
  const [trips, setTrips] = useState([]);

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
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddTrip")}>
            <Text style={styles.addButtonText}>+ Add Your First Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.tripList}>
          {trips.map((trip, index) => (
            <TouchableOpacity key={index} style={styles.tripCard}>
              <Text style={styles.tripCity}>{trip.city}</Text>
              <Text style={styles.tripDates}>{trip.dates}</Text>
              <Text style={styles.tripMood}>{trip.mood}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },
  title: { fontSize: 22, fontWeight: "700" },
  
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "600", marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 20 },
  
  addButton: { backgroundColor: "#2563eb", paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10 },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  tripList: { padding: 20 },
  tripCard: {
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
  tripMood: { fontSize: 14, color: "#2563eb", fontWeight: "500" },
});
