// src/screens/FlightResultsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchFlightsAPI } from "../api/client";

const FlightResultsScreen = ({ route, navigation }) => {
  const {
    departure,
    destination,
    departureDate,
    returnDate,
    passengers,
    budget,
    allowLayover,
  } = route.params;

  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const { aiSummary } = await searchFlightsAPI({
          departure,
          destination,
          departureDate: departureDate || null,
          returnDate: returnDate || null,
          passengers,
          budget,
          allowLayover,
        });
        setAiSummary(aiSummary || "");
      } catch (err) {
        console.error("Error fetching flights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const handleSave = async () => {
    try {
      const stored = await AsyncStorage.getItem("savedFlights");
      const saved = stored ? JSON.parse(stored) : [];

      const newFlight = {
        id: Date.now(),
        departure,
        destination,
        departureDate: departureDate || null,
        returnDate: returnDate || null,
        summary: aiSummary,
      };

      await AsyncStorage.setItem(
        "savedFlights",
        JSON.stringify([...saved, newFlight])
      );

      Alert.alert("✅ Saved", "This flight was saved.");
      navigation.navigate("MainTabs", { screen: "Flights" });
    } catch (err) {
      console.error("Error saving flight:", err);
      Alert.alert("❌ Error", "Could not save flight.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Searching flights...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Flight Card */}
      <View style={styles.flightCard}>
        <Text style={styles.route}>
          {departure} → {destination}
        </Text>
        <Text style={styles.date}>
          {departureDate || ""}
          {returnDate ? ` - ${returnDate}` : ""}
        </Text>
      </View>

      {/* View Details */}
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() =>
          navigation.navigate("FlightDetails", {
            flight: {
              departure,
              destination,
              departureDate: departureDate || null,
              returnDate: returnDate || null,
              summary: aiSummary,
            },
          })
        }
      >
        <Text style={styles.detailsText}>📄 View Details</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>❤️ Save Recommendation</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  flightCard: {
    backgroundColor: "#f1f6ff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  route: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  date: { fontSize: 15, color: "gray" },
  detailsButton: {
    backgroundColor: "#e9ecef",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  detailsText: { fontSize: 16, fontWeight: "600", color: "#333" },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "white", fontSize: 16, fontWeight: "600" },
});

export default FlightResultsScreen;








