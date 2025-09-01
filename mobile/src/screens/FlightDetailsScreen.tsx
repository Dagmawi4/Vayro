// src/screens/FlightDetailsScreen.tsx
import React from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display"; // ✅ Markdown renderer

const FlightDetailsScreen = ({ route, navigation }) => {
  // ✅ Extract flight object
  const { flight } = route.params;
  const { departure, destination, departureDate, returnDate, summary } = flight;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Main content scrollable */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.title}>
          {departure} → {destination}
        </Text>
        <Text style={styles.dates}>
          {departureDate || ""}
          {returnDate ? ` – ${returnDate}` : " (One Way)"}
        </Text>

        {/* AI Recommendation Summary (fills screen, scrollable if long) */}
        <View style={styles.summaryBox}>
          <Markdown style={markdownStyles}>
            {summary || "No details available for this flight."}
          </Markdown>
        </View>
      </ScrollView>

      {/* Back Button pinned at bottom */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>⬅ Back to Flights</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 80 }, // keep space above button
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  dates: { fontSize: 15, color: "gray", marginBottom: 20 },

  summaryBox: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
    width: "100%", // full screen width
  },

  backButton: {
    backgroundColor: "#007bff",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

// ✅ Custom Markdown styles
const markdownStyles = {
  body: { fontSize: 15, color: "#333", lineHeight: 22 },
  bullet_list: { marginVertical: 4 },
  ordered_list: { marginVertical: 4 },
  list_item: { marginVertical: 2 },
  heading1: { fontSize: 20, fontWeight: "700", marginVertical: 6 },
  heading2: { fontSize: 18, fontWeight: "600", marginVertical: 6 },
  heading3: { fontSize: 16, fontWeight: "600", marginVertical: 4 },
  strong: { fontWeight: "700" },
};

export default FlightDetailsScreen;






