import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { Country, City } from "country-state-city";

type Props = NativeStackScreenProps<RootStackParamList, "AddTrip">;

export default function AddTripScreen({ navigation }: Props) {
  const [departCountry, setDepartCountry] = useState<string | null>(null);
  const [departCity, setDepartCity] = useState<string | null>(null);
  const [destCountry, setDestCountry] = useState<string | null>(null);
  const [destCity, setDestCity] = useState<string | null>(null);
  const [mode, setMode] = useState<"air" | "car" | null>(null);

  // Get all countries dynamically
  const countries = Country.getAllCountries().map((c) => ({
    label: c.name,
    value: c.isoCode,
  }));

  // Get cities dynamically based on country ISO code
  const getCitiesForCountry = (isoCode: string) =>
    City.getCitiesOfCountry(isoCode).map((city) => ({
      label: city.name,
      value: city.name,
    }));

  function handleNext() {
    if (!departCountry || !departCity || !destCountry || !destCity || !mode) {
      Alert.alert("Missing Info", "Please complete all fields.");
      return;
    }

    if (mode === "car" && departCountry !== destCountry) {
      Alert.alert(
        "Invalid Trip",
        "Car trips must be within the same country."
      );
      return;
    }

    if (mode === "air") {
      navigation.navigate("Airport", {
        departCountry,
        departCity,
        destCountry,
        destCity,
        mode,
      });
    } else if (mode === "car") {
      navigation.navigate("CarTrip", {
        departCountry,
        departCity,
        destCountry,
        destCity,
        mode,
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Plan Your Trip 🌍</Text>

      {/* Departing Country */}
      <Text style={styles.label}>Departing Country</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={countries}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select country"
        searchPlaceholder="Search..."
        value={departCountry}
        onChange={(item) => {
          setDepartCountry(item.value);
          setDepartCity(null);
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} name="earth" size={18} />
        )}
      />

      {/* Departing City */}
      <Text style={styles.label}>Departing City</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={departCountry ? getCitiesForCountry(departCountry) : []}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select city"
        searchPlaceholder="Search..."
        value={departCity}
        onChange={(item) => setDepartCity(item.value)}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} name="enviromento" size={18} />
        )}
      />

      {/* Destination Country */}
      <Text style={styles.label}>Destination Country</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={countries}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select country"
        searchPlaceholder="Search..."
        value={destCountry}
        onChange={(item) => {
          setDestCountry(item.value);
          setDestCity(null);
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} name="earth" size={18} />
        )}
      />

      {/* Destination City */}
      <Text style={styles.label}>Destination City</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={destCountry ? getCitiesForCountry(destCountry) : []}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select city"
        searchPlaceholder="Search..."
        value={destCity}
        onChange={(item) => setDestCity(item.value)}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} name="enviromento" size={18} />
        )}
      />

      {/* Transport Mode */}
      <Text style={styles.label}>How are you getting there?</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.chip, mode === "air" && styles.chipOn]}
          onPress={() => setMode("air")}
        >
          <Text style={[styles.chipText, mode === "air" && styles.chipTextOn]}>
            ✈️ Air
          </Text>
        </Pressable>
        <Pressable
          style={[styles.chip, mode === "car" && styles.chipOn]}
          onPress={() => setMode("car")}
        >
          <Text style={[styles.chipText, mode === "car" && styles.chipTextOn]}>
            🚗 Car
          </Text>
        </Pressable>
      </View>

      {/* Next Button */}
      <Pressable
        style={[
          styles.button,
          (!departCountry || !destCountry || !mode) && { opacity: 0.6 },
        ]}
        onPress={handleNext}
        disabled={!departCountry || !destCountry || !mode}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, marginTop: 10 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 50,
  },
  placeholderStyle: { fontSize: 14, color: "#9ca3af" },
  selectedTextStyle: { fontSize: 14, color: "#111827" },
  inputSearchStyle: { fontSize: 14, height: 40 },
  iconStyle: { width: 20, height: 20 },
  icon: { marginRight: 8, color: "#6b7280" },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  chip: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  chipOn: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#111827", fontWeight: "600" },
  chipTextOn: { color: "#fff" },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});







