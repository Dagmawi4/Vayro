// src/screens/PrefsScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";

type Props = NativeStackScreenProps<RootStackParamList, "PrefsScreen">;

export default function PrefsScreen({ navigation, route }: Props) {
  const { departCountry, departCity, destCountry, destCity, mode } = route.params;

  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [mood, setMood] = useState<"vacation" | "business" | "">("");
  const [food, setFood] = useState("");
  const [activities, setActivities] = useState("");

  const [travelSolo, setTravelSolo] = useState<null | boolean>(null);
  const [groupSize, setGroupSize] = useState("");

  const [hasCommitments, setHasCommitments] = useState<null | boolean>(null);
  const [commitments, setCommitments] = useState<string[]>([""]);

  const [visitedBefore, setVisitedBefore] = useState<null | boolean>(null);
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>([""]);

  // Calendar selection (range: start + end)
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  const handleDayPress = (day: { dateString: string }) => {
    if (!startDate || (startDate && endDate)) {
      // reset selection
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: { startingDay: true, endingDay: true, color: "#2563eb", textColor: "#fff" },
      });
      setDuration("1");
    } else if (startDate && !endDate) {
      if (dayjs(day.dateString).isBefore(dayjs(startDate))) {
        Alert.alert("Invalid Selection", "End date must be after start date.");
        return;
      }
      setEndDate(day.dateString);

      const range: { [key: string]: any } = {};
      let diff = dayjs(day.dateString).diff(dayjs(startDate), "day") + 1;
      for (let i = 0; i < diff; i++) {
        const date = dayjs(startDate).add(i, "day").format("YYYY-MM-DD");
        range[date] = {
          color: "#2563eb",
          textColor: "#fff",
          startingDay: i === 0,
          endingDay: i === diff - 1,
        };
      }
      setMarkedDates(range);
      setDuration(diff.toString());
    }
  };

  const handlePlanTrip = () => {
    if (!duration) {
      Alert.alert("Missing Info", "Please select trip dates.");
      return;
    }
    navigation.navigate("TripPlan", {
      departCountry,
      departCity,
      destCountry,
      destCity,
      mode,
      duration,
      budget,
      mood,
      food,
      activities,
      travelSolo: travelSolo ? "Solo" : `Group of ${groupSize}`,
      commitments: hasCommitments
        ? commitments.filter((c) => c.trim() !== "")
        : [],
      visitedBefore: visitedBefore
        ? visitedPlaces.filter((p) => p.trim() !== "")
        : [],
      tripDates: startDate && endDate ? [startDate, endDate] : [startDate],
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>📝 Plan Your Trip</Text>
          <Text style={styles.subheader}>
            Customize your trip to <Text style={styles.highlight}>{destCity}</Text>.
          </Text>

          {/* Calendar + Duration */}
          <Text style={styles.label}>Select Trip Dates</Text>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            minDate={dayjs().format("YYYY-MM-DD")} // 🚫 block past dates
            markingType="period"
          />

          <Text style={styles.label}>Trip Duration (days)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5"
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
          />

          {/* Budget */}
          <Text style={styles.label}>Budget ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1000"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />

          {/* Mood */}
          <Text style={styles.label}>Mood</Text>
          <View style={styles.row}>
            {["vacation", "business"].map((option) => (
              <Pressable
                key={option}
                style={[styles.chip, mood === option && styles.chipOn]}
                onPress={() => setMood(option as "vacation" | "business")}
              >
                <Text style={[styles.chipText, mood === option && styles.chipTextOn]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Food */}
          <Text style={styles.label}>Food Preferences</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Seafood, Vegan"
            value={food}
            onChangeText={setFood}
          />

          {/* Activities */}
          <Text style={styles.label}>Desired Activities</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Museums, Hiking"
            value={activities}
            onChangeText={setActivities}
          />

          {/* Solo or Group */}
          <Text style={styles.label}>Are you traveling solo?</Text>
          <View style={styles.row}>
            {["Yes", "No"].map((option, idx) => (
              <Pressable
                key={option}
                style={[
                  styles.chip,
                  travelSolo === (idx === 0) && styles.chipOn,
                ]}
                onPress={() => setTravelSolo(idx === 0)}
              >
                <Text
                  style={[
                    styles.chipText,
                    travelSolo === (idx === 0) && styles.chipTextOn,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
          {travelSolo === false && (
            <TextInput
              style={styles.input}
              placeholder="Number of people in group"
              keyboardType="numeric"
              value={groupSize}
              onChangeText={setGroupSize}
            />
          )}

          {/* Commitments */}
          <Text style={styles.label}>Any fixed commitments?</Text>
          <View style={styles.row}>
            {["Yes", "No"].map((option, idx) => (
              <Pressable
                key={option}
                style={[
                  styles.chip,
                  hasCommitments === (idx === 0) && styles.chipOn,
                ]}
                onPress={() => setHasCommitments(idx === 0)}
              >
                <Text
                  style={[
                    styles.chipText,
                    hasCommitments === (idx === 0) && styles.chipTextOn,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
          {hasCommitments && (
            <>
              {commitments.map((c, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  placeholder={`Commitment ${index + 1}`}
                  value={c}
                  onChangeText={(text) => {
                    const updated = [...commitments];
                    updated[index] = text;
                    setCommitments(updated);
                  }}
                />
              ))}
              <Pressable
                style={styles.addButton}
                onPress={() => setCommitments([...commitments, ""])}
              >
                <Text style={styles.addButtonText}>+ Add another</Text>
              </Pressable>
            </>
          )}

          {/* Visited Before */}
          <Text style={styles.label}>Have you been to {destCity} before?</Text>
          <View style={styles.row}>
            {["Yes", "No"].map((option, idx) => (
              <Pressable
                key={option}
                style={[
                  styles.chip,
                  visitedBefore === (idx === 0) && styles.chipOn,
                ]}
                onPress={() => setVisitedBefore(idx === 0)}
              >
                <Text
                  style={[
                    styles.chipText,
                    visitedBefore === (idx === 0) && styles.chipTextOn,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
          {visitedBefore && (
            <>
              {visitedPlaces.map((p, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  placeholder={`Place ${index + 1}`}
                  value={p}
                  onChangeText={(text) => {
                    const updated = [...visitedPlaces];
                    updated[index] = text;
                    setVisitedPlaces(updated);
                  }}
                />
              ))}
              <Pressable
                style={styles.addButton}
                onPress={() => setVisitedPlaces([...visitedPlaces, ""])}
              >
                <Text style={styles.addButtonText}>+ Add another</Text>
              </Pressable>
            </>
          )}

          {/* Button */}
          <Pressable style={styles.button} onPress={handlePlanTrip}>
            <Text style={styles.buttonText}>Plan My Trip</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
    color: "#111827",
  },
  subheader: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  highlight: { fontWeight: "700", color: "#2563eb" },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 6, marginTop: 16 },
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
  row: { flexDirection: "row", gap: 10, marginBottom: 12 },
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
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  addButton: { marginBottom: 12, alignSelf: "flex-start" },
  addButtonText: { color: "#2563eb", fontWeight: "600" },
});




