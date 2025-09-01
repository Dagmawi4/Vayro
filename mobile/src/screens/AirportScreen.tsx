import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Airport">;

export default function AirportScreen({ navigation, route }: Props) {
  const {
    departCountry = "",
    departCity = "",
    destCountry = "",
    destCity = "",
    mode = "air",
  } = route.params || {};

  const [airport, setAirport] = useState("");
  const [airportCity, setAirportCity] = useState(""); // ✅ track city
  const [airportCountry, setAirportCountry] = useState(""); // ✅ track country
  const [destination, setDestination] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const [airportSuggestions, setAirportSuggestions] = useState<any[]>([]);
  const [placeSuggestions, setPlaceSuggestions] = useState<any[]>([]);

  // 🔎 Fetch airports from backend (Amadeus global)
  async function fetchAirports(query: string) {
    setAirport(query);
    if (query.length < 2) {
      setAirportSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `http://10.0.0.128:4000/api/airports/search?keyword=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setAirportSuggestions(data.airports || []);
    } catch (err) {
      console.error("Airport fetch error:", err);
    }
  }

  function handleSelectAirport(item: any) {
    const formatted = `${item.name} (${item.iataCode}) — ${item.city}, ${item.country}`;
    setAirport(formatted);
    setAirportCity(item.city || "");
    setAirportCountry(item.country || "");
    setAirportSuggestions([]);
  }

  function clearAirport() {
    setAirport("");
    setAirportCity("");
    setAirportCountry("");
    setAirportSuggestions([]);
  }

  // 🔎 Fetch addresses from backend (Google Places)
  async function fetchPlaces(query: string) {
    setDestination(query);
    if (query.length < 3) {
      setPlaceSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `http://10.0.0.128:4000/api/places/autocomplete?input=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setPlaceSuggestions(data.predictions || []);
    } catch (err) {
      console.error("Places fetch error:", err);
    }
  }

  function handleSelectPlace(place: any) {
    setDestination(place.description);
    setPlaceSuggestions([]);
  }

  function clearDestination() {
    setDestination("");
    setPlaceSuggestions([]);
  }

  // ✅ Require destination only if airport is in US
  const destinationRequired = airportCountry === "United States";
  const canProceed =
    airport && arrivalTime && (!destinationRequired || destination);

  function handleSeeOptions() {
    navigation.navigate("TransportOptions", {
      departCountry,
      departCity,
      destCountry,
      destCity,
      airport,
      airportCity,
      airportCountry,
      destination,
      undecided: destination === "Undecided",
      arrivalTime,
      mode,
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Arrival Details</Text>
        <Text style={styles.subtitle}>
          Trip to <Text style={styles.highlight}>{destCity || "your destination"}</Text>
        </Text>

        {/* Arrival Airport */}
        <Text style={styles.label}>Arrival Airport</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Search for arrival airport"
            value={airport}
            onChangeText={fetchAirports}
          />
          {airport.length > 0 && (
            <TouchableOpacity onPress={clearAirport} style={styles.clearButton}>
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {airportSuggestions.length > 0 && (
          <View style={styles.suggestions}>
            {airportSuggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelectAirport(item)}
              >
                <Text style={styles.suggestionItem}>
                  {item.name} ({item.iataCode}) — {item.city}, {item.country}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Destination Address */}
        <Text style={styles.label}>
          Destination Address{" "}
          {destinationRequired && <Text style={{ color: "red" }}>*</Text>}
        </Text>

        {/* Undecided option */}
        <TouchableOpacity
          onPress={() => setDestination("Undecided")}
          style={styles.undecidedButton}
        >
          <Text style={styles.undecidedText}>I haven’t decided yet</Text>
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={
              destinationRequired
                ? "Required in the US (e.g., 123 Ocean Dr, Miami Beach)"
                : "Optional (Outside US)"
            }
            value={destination}
            onChangeText={fetchPlaces}
          />
          {destination.length > 0 && (
            <TouchableOpacity
              onPress={clearDestination}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {placeSuggestions.length > 0 && (
          <View style={styles.suggestions}>
            {placeSuggestions.map((item: any) => (
              <TouchableOpacity
                key={item.place_id}
                onPress={() => handleSelectPlace(item)}
              >
                <Text style={styles.suggestionItem}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Arrival Time */}
        <Text style={styles.label}>Arrival Time</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2:45 PM"
          value={arrivalTime}
          onChangeText={setArrivalTime}
        />
      </ScrollView>

      {/* Sticky Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.button, !canProceed && { opacity: 0.6 }]}
          disabled={!canProceed}
          onPress={handleSeeOptions}
        >
          <Text style={styles.buttonText}>See Transport Options</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, gap: 20 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 12 },
  highlight: { color: "#2563eb", fontWeight: "600" },

  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },

  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    paddingRight: 35,
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  clearText: { fontSize: 16, color: "#333" },

  suggestions: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginTop: -10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },

  undecidedButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  undecidedText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#f1f1f1",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});









