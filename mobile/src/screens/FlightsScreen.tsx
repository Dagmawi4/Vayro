import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SavedFlight {
  id: number;
  departure: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  summary: string;
}

const FlightsScreen = ({ navigation }) => {
  const [flights, setFlights] = useState<SavedFlight[]>([]);

  // Load saved flights whenever screen comes into focus
  useEffect(() => {
    const loadFlights = async () => {
      try {
        const stored = await AsyncStorage.getItem("savedFlights");
        if (stored) setFlights(JSON.parse(stored));
        else setFlights([]);
      } catch (err) {
        console.error("Error loading saved flights:", err);
      }
    };

    const unsubscribe = navigation.addListener("focus", loadFlights);
    return unsubscribe;
  }, [navigation]);

  const handleAddFlight = () => {
    navigation.navigate("FlightForm");
  };

  if (flights.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={{
            uri: "https://img.icons8.com/color/96/airplane-take-off.png",
          }}
          style={styles.icon}
        />
        <Text style={styles.title}>No flights saved yet</Text>
        <Text style={styles.subtitle}>
          Start by finding and saving your first flight.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleAddFlight}>
          <Text style={styles.buttonText}>+ Find a Flight</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={flights}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.flightCard}
            onPress={() =>
              navigation.navigate("FlightDetails", {
                flight: item,
              })
            }
          >
            <Text style={styles.flightTitle}>
              {item.departure} → {item.destination}
            </Text>
            <Text style={styles.flightDates}>
              {new Date(item.departureDate).toDateString()}
              {item.returnDate
                ? ` – ${new Date(item.returnDate).toDateString()}`
                : " (One Way)"}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddFlight}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  icon: { width: 80, height: 80, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "600" },
  flightCard: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  flightTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  flightDates: { fontSize: 13, color: "gray" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 30, lineHeight: 30 },
});

export default FlightsScreen;







