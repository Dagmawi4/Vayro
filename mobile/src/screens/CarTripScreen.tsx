// src/screens/CarTripScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function CarTripScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ Get params passed from AddTripScreen
  const { destCity, departCountry, departCity, destCountry } = route.params as {
    destCity: string;
    departCountry: string;
    departCity: string;
    destCountry: string;
  };

  const [startingPoint, setStartingPoint] = useState(departCity || "");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [eta, setEta] = useState("");
  const [stops, setStops] = useState<string[]>([""]);

  const handleArrived = () => {
    if (!startingPoint || !destinationAddress || !eta) {
      Alert.alert("Missing Info", "Please fill out all required fields.");
      return;
    }

    navigation.navigate("PrefsScreen" as never, {
      departCountry,
      departCity: startingPoint, // ✅ allow custom start point
      destCountry,
      destCity, // ✅ consistent naming
      mode: "car",
      destination: destinationAddress,
      eta,
      stops: stops.filter((s) => s.trim() !== ""), // only filled stops
      airport: "",
    } as never);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Text style={styles.header}>🚗 Car Trip Details</Text>
          <Text style={styles.subheader}>
            You’re heading to <Text style={styles.highlight}>{destCity}</Text>.  
            Enter your trip details so we can customize your plan.
          </Text>

          {/* Starting Point */}
          <Text style={styles.label}>Starting Point</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Minneapolis"
            value={startingPoint}
            onChangeText={setStartingPoint}
          />

          {/* Destination Address */}
          <Text style={styles.label}>Destination Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 123 Main St, Hotel ABC"
            value={destinationAddress}
            onChangeText={setDestinationAddress}
          />

          {/* ETA */}
          <Text style={styles.label}>Estimated Time of Arrival</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2:30 PM"
            value={eta}
            onChangeText={setEta}
          />

          {/* Stops */}
          <Text style={styles.label}>Stops Along the Way (optional)</Text>
          {stops.map((stop, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Stop ${index + 1}`}
              value={stop}
              onChangeText={(text) => {
                const updated = [...stops];
                updated[index] = text;
                setStops(updated);
              }}
            />
          ))}
          <Pressable
            style={styles.addButton}
            onPress={() => setStops([...stops, ""])}
          >
            <Text style={styles.addButtonText}>+ Add another stop</Text>
          </Pressable>

          {/* Button */}
          <Pressable style={styles.button} onPress={handleArrived}>
            <Text style={styles.buttonText}>Arrived at Destination</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#111827",
  },
  subheader: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  highlight: {
    fontWeight: "700",
    color: "#2563eb",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  addButton: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});


