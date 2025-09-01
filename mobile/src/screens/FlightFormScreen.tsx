// src/screens/FlightFormScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";

const API_BASE = "http://10.0.0.128:4000"; // ✅ backend base URL

// ✅ Fix: format local date without UTC shift
function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // YYYY-MM-DD
}

export default function FlightFormScreen({ navigation }) {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");

  const [roundTrip, setRoundTrip] = useState(true);

  const [departureDate, setDepartureDate] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState<string | null>(null);

  const [passengers, setPassengers] = useState("1");
  const [budget, setBudget] = useState("");
  const [allowLayover, setAllowLayover] = useState(false);

  // ✅ Suggestions
  const [departSuggestions, setDepartSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);

  const today = formatLocalDate(new Date()); // ✅ fixed

  async function fetchAirports(query: string, setFn: any) {
    if (query.length < 2) {
      setFn([]);
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/api/airports/search?keyword=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setFn(data.airports || []);
    } catch (err) {
      console.error("Airport fetch error:", err);
    }
  }

  function handleSelectAirport(item: any, setValue: any, clearFn: any) {
    setValue(item.iataCode); // ✅ store IATA code
    clearFn([]);
  }

  function handleDayPress(day: any) {
    if (!departureDate || (departureDate && returnDate)) {
      // ✅ reset selection
      setDepartureDate(day.dateString);
      setReturnDate(null);
    } else if (departureDate && !returnDate) {
      if (day.dateString < departureDate) {
        // ✅ prevent backwards
        setDepartureDate(day.dateString);
        setReturnDate(null);
      } else {
        setReturnDate(day.dateString);
      }
    }
  }

  function markedDates() {
    const marks: any = {};
    if (departureDate) {
      marks[departureDate] = {
        selected: true,
        startingDay: true,
        color: "#007bff",
        textColor: "white",
      };
    }
    if (returnDate) {
      marks[returnDate] = {
        selected: true,
        endingDay: true,
        color: "#007bff",
        textColor: "white",
      };

      // ✅ highlight range
      let start = new Date(departureDate!);
      let end = new Date(returnDate);
      let cur = new Date(start);
      cur.setDate(cur.getDate() + 1);
      while (cur < end) {
        const ds = formatLocalDate(cur); // ✅ fixed
        marks[ds] = { color: "#a5d8ff", textColor: "black" };
        cur.setDate(cur.getDate() + 1);
      }
    }
    return marks;
  }

  const onSearchFlights = () => {
    if (!departure || !destination) {
      Alert.alert("Missing info", "Please select both departure and destination airports.");
      return;
    }
    if (!departureDate) {
      Alert.alert("Missing date", "Please select a departure date.");
      return;
    }
    if (roundTrip && !returnDate) {
      Alert.alert("Missing return date", "Please select a return date.");
      return;
    }

    navigation.navigate("FlightResults", {
      departure: departure.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      departureDate,
      returnDate: roundTrip ? returnDate : null,
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

        {/* Departure Airport */}
        <Text style={styles.label}>Departure Airport</Text>
        <TextInput
          style={styles.input}
          placeholder="Search departure airport"
          value={departure}
          onChangeText={(text) => {
            setDeparture(text);
            fetchAirports(text, setDepartSuggestions);
          }}
        />
        {departSuggestions.length > 0 && (
          <View style={styles.suggestions}>
            {departSuggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  handleSelectAirport(item, setDeparture, setDepartSuggestions)
                }
              >
                <Text style={styles.suggestionItem}>
                  {item.name} ({item.iataCode}) — {item.city}, {item.country}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Destination Airport */}
        <Text style={styles.label}>Destination Airport</Text>
        <TextInput
          style={styles.input}
          placeholder="Search destination airport"
          value={destination}
          onChangeText={(text) => {
            setDestination(text);
            fetchAirports(text, setDestSuggestions);
          }}
        />
        {destSuggestions.length > 0 && (
          <View style={styles.suggestions}>
            {destSuggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  handleSelectAirport(item, setDestination, setDestSuggestions)
                }
              >
                <Text style={styles.suggestionItem}>
                  {item.name} ({item.iataCode}) — {item.city}, {item.country}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Round Trip Toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>Round Trip</Text>
          <Switch
            value={roundTrip}
            onValueChange={(val) => {
              setRoundTrip(val);
              if (!val) setReturnDate(null); // ✅ clear return if one-way
            }}
          />
        </View>

        {/* Calendar */}
        <Text style={styles.label}>
          {roundTrip ? "Select Departure and Return Dates" : "Select Departure Date"}
        </Text>
        <Calendar
          minDate={today}
          onDayPress={handleDayPress}
          markingType={roundTrip ? "period" : "simple"}
          markedDates={markedDates()}
        />

        {/* Passengers */}
        <Text style={styles.label}>Passengers</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of Passengers"
          keyboardType="numeric"
          value={passengers}
          onChangeText={setPassengers}
        />

        {/* Budget */}
        <Text style={styles.label}>Budget (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 500"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />

        {/* Allow Layovers */}
        <View style={styles.row}>
          <Text style={styles.label}>Allow Layovers</Text>
          <Switch value={allowLayover} onValueChange={setAllowLayover} />
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={onSearchFlights}>
          <Text style={styles.searchText}>🔍 Search Flights</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "gray", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  suggestions: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  searchText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
