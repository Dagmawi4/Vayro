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
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { Calendar } from "react-native-calendars";

type Props = NativeStackScreenProps<RootStackParamList, "PrefsScreen">;

export default function PrefsScreen({ navigation, route }: Props) {
  const { departCountry, departCity, destCountry, destCity, mode } = route.params;

  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [mood, setMood] = useState<"vacation" | "business" | "">("");
  const [food, setFood] = useState("");
  const [activities, setActivities] = useState("");

  // Solo or Group
  const [travelSolo, setTravelSolo] = useState<null | boolean>(null);
  const [groupSize, setGroupSize] = useState("");

  // Commitments
  const [hasCommitments, setHasCommitments] = useState<null | boolean>(null);
  const [commitments, setCommitments] = useState<string[]>([""]);

  // Visited City Before
  const [visitedBefore, setVisitedBefore] = useState<null | boolean>(null);
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>([""]);

  // Calendar selection
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({});

  const handleDayPress = (day: { dateString: string }) => {
    const newDates = { ...selectedDates };
    if (newDates[day.dateString]) {
      delete newDates[day.dateString]; // unselect if already selected
    } else {
      newDates[day.dateString] = {
        selected: true,
        selectedColor: "#2563eb",
      };
    }
    setSelectedDates(newDates);
  };

  const handlePlanTrip = () => {
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
      tripDates: Object.keys(selectedDates).sort(), // pass sorted list of selected dates
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.title}>Plan your trip</Text>
          <Text style={styles.sub}>
            Tell us more about your trip so we can customize your plan.
          </Text>

          {/* Duration */}
          <Text style={styles.label}>Trip Duration (days)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5"
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
          />

          {/* Calendar Picker */}
          <Text style={styles.label}>Select Trip Dates</Text>
          <Calendar onDayPress={handleDayPress} markedDates={selectedDates} />

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
            <Pressable
              style={[styles.chip, mood === "vacation" && styles.chipOn]}
              onPress={() => setMood("vacation")}
            >
              <Text
                style={[
                  styles.chipText,
                  mood === "vacation" && styles.chipTextOn,
                ]}
              >
                Vacation
              </Text>
            </Pressable>
            <Pressable
              style={[styles.chip, mood === "business" && styles.chipOn]}
              onPress={() => setMood("business")}
            >
              <Text
                style={[
                  styles.chipText,
                  mood === "business" && styles.chipTextOn,
                ]}
              >
                Business
              </Text>
            </Pressable>
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
            <Pressable
              style={[styles.chip, travelSolo === true && styles.chipOn]}
              onPress={() => setTravelSolo(true)}
            >
              <Text
                style={[
                  styles.chipText,
                  travelSolo === true && styles.chipTextOn,
                ]}
              >
                Yes
              </Text>
            </Pressable>
            <Pressable
              style={[styles.chip, travelSolo === false && styles.chipOn]}
              onPress={() => setTravelSolo(false)}
            >
              <Text
                style={[
                  styles.chipText,
                  travelSolo === false && styles.chipTextOn,
                ]}
              >
                No
              </Text>
            </Pressable>
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
            <Pressable
              style={[styles.chip, hasCommitments === true && styles.chipOn]}
              onPress={() => setHasCommitments(true)}
            >
              <Text
                style={[
                  styles.chipText,
                  hasCommitments === true && styles.chipTextOn,
                ]}
              >
                Yes
              </Text>
            </Pressable>
            <Pressable
              style={[styles.chip, hasCommitments === false && styles.chipOn]}
              onPress={() => setHasCommitments(false)}
            >
              <Text
                style={[
                  styles.chipText,
                  hasCommitments === false && styles.chipTextOn,
                ]}
              >
                No
              </Text>
            </Pressable>
          </View>
          {hasCommitments && (
            <>
              {commitments.map((c, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  placeholder={`e.g., I have a work meeting on Tuesday at 10 am`}
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
                <Text style={styles.addButtonText}>+ Add another commitment</Text>
              </Pressable>
            </>
          )}

          {/* Visited Before */}
          <Text style={styles.label}>
            Have you been to {destCity} before?
          </Text>
          <View style={styles.row}>
            <Pressable
              style={[styles.chip, visitedBefore === true && styles.chipOn]}
              onPress={() => setVisitedBefore(true)}
            >
              <Text
                style={[
                  styles.chipText,
                  visitedBefore === true && styles.chipTextOn,
                ]}
              >
                Yes
              </Text>
            </Pressable>
            <Pressable
              style={[styles.chip, visitedBefore === false && styles.chipOn]}
              onPress={() => setVisitedBefore(false)}
            >
              <Text
                style={[
                  styles.chipText,
                  visitedBefore === false && styles.chipTextOn,
                ]}
              >
                No
              </Text>
            </Pressable>
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
                <Text style={styles.addButtonText}>+ Add another place</Text>
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
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  sub: { color: "#6b7280", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  row: { flexDirection: "row", gap: 10, marginBottom: 16 },
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
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  addButton: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});



