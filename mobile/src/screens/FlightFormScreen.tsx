// src/screens/FlightFormScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const FlightFormScreen = ({ navigation }) => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [passengers, setPassengers] = useState("1");
  const [budget, setBudget] = useState("");
  const [allowLayover, setAllowLayover] = useState(false);
  const [roundTrip, setRoundTrip] = useState(true); // ✅ toggle one-way vs round-trip

  const onSearchFlights = () => {
    if (!departure || !destination) {
      Alert.alert("Missing info", "Please enter both departure and destination.");
      return;
    }

    navigation.navigate("FlightResults", {
      departure: departure.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      departureDate: departureDate.toISOString().split("T")[0], // ✅ send YYYY-MM-DD only
      returnDate: roundTrip ? returnDate.toISOString().split("T")[0] : null,
      passengers: parseInt(passengers) || 1,
      budget: budget ? parseInt(budget) : undefined,
      allowLayover,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Find Your Flight ✈️</Text>
        <Text style={styles.subtitle}>
          Enter your details and we’ll find the best options for you
        </Text>

        {/* Departure */}
        <TextInput
          style={styles.input}
          placeholder="Departure Airport (e.g. JFK)"
          value={departure}
          onChangeText={setDeparture}
          autoCapitalize="characters"
        />

        {/* Destination */}
        <TextInput
          style={styles.input}
          placeholder="Destination Airport (e.g. LHR)"
          value={destination}
          onChangeText={setDestination}
          autoCapitalize="characters"
        />

        {/* Trip type toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>Round Trip</Text>
          <Switch value={roundTrip} onValueChange={setRoundTrip} />
        </View>

        {/* Departure Date */}
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDeparturePicker(true)}
        >
          <Text style={styles.dateText}>
            Departure: {departureDate.toDateString()}
          </Text>
        </TouchableOpacity>
        {showDeparturePicker && (
          <DateTimePicker
            value={departureDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, date) => {
              setShowDeparturePicker(false);
              if (date) setDepartureDate(date);
            }}
          />
        )}

        {/* Return Date (only if round trip) */}
        {roundTrip && (
          <>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowReturnPicker(true)}
            >
              <Text style={styles.dateText}>
                Return: {returnDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showReturnPicker && (
              <DateTimePicker
                value={returnDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, date) => {
                  setShowReturnPicker(false);
                  if (date) setReturnDate(date);
                }}
              />
            )}
          </>
        )}

        {/* Passengers */}
        <TextInput
          style={styles.input}
          placeholder="Number of Passengers"
          keyboardType="numeric"
          value={passengers}
          onChangeText={setPassengers}
        />

        {/* Budget */}
        <TextInput
          style={styles.input}
          placeholder="Budget (Optional, e.g. 500)"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />

        {/* Layover toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>Allow Layovers</Text>
          <Switch value={allowLayover} onValueChange={setAllowLayover} />
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.searchButton} onPress={onSearchFlights}>
          <Text style={styles.searchText}>🔍 Search Flights</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  searchText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default FlightFormScreen;

