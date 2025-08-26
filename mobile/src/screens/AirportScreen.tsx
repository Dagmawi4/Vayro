import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
  const [destination, setDestination] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  function handleSeeOptions() {
    navigation.navigate("TransportOptions", {
      departCountry,
      departCity,
      destCountry,
      destCity,
      airport,
      destination,
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
        <TextInput
          style={styles.input}
          placeholder="e.g., MIA — Miami International"
          value={airport}
          onChangeText={setAirport}
        />

        {/* Destination Address */}
        <Text style={styles.label}>Destination Address</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 123 Ocean Dr, Miami Beach"
          value={destination}
          onChangeText={setDestination}
        />

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
          style={[styles.button, (!airport || !destination || !arrivalTime) && { opacity: 0.6 }]}
          disabled={!airport || !destination || !arrivalTime}
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
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
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




