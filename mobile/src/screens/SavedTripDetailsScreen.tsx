// src/screens/SavedTripDetailsScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Linking,
  LayoutAnimation,
  UIManager,
  Platform,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// Enable expand animation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, "SavedTripDetails">;

interface Place {
  name: string;
  description: string;
  type?: string;
  priceRange?: string;
  hours?: string;
  parking?: string;
  website?: string;
  phone?: string;
  address?: string;
}

interface TimeSlot {
  time: string;
  options: Place[];
}

interface DayPlan {
  day: string;
  schedule: TimeSlot[];
}

interface BudgetSummary {
  [day: string]: { estimated: number; budget: number; status: string };
}

export default function SavedTripDetailsScreen({ route }: Props) {
  const { destCity, destCountry, duration, tripDates, plan, budgetSummary } =
    route.params;

  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({});

  const toggleDay = (day: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const openMaps = (address: string) => {
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?q=${encodeURIComponent(address)}`
        : `geo:0,0?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const callNumber = (phone: string) => {
    if (phone && phone !== "No phone available") {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const renderOptions = (places: Place[]) => {
    return places.map((place, idx) => (
      <View key={idx} style={styles.placeCard}>
        <Text style={styles.placeName}>📍 {place.name}</Text>
        <Text style={styles.placeDesc}>{place.description}</Text>
        {place.type && <Text style={styles.meta}>🏷️ {place.type}</Text>}
        {place.priceRange && <Text style={styles.meta}>💲 {place.priceRange}</Text>}
        {place.hours && <Text style={styles.meta}>⏰ {place.hours}</Text>}
        {place.parking && <Text style={styles.meta}>🚗 {place.parking}</Text>}

        {/* Website */}
        {place.website && place.website !== "No website available" ? (
          <Text style={styles.link} onPress={() => Linking.openURL(place.website!)}>
            🔗 Website
          </Text>
        ) : (
          <Text style={styles.meta}>No website available</Text>
        )}

        {/* Phone */}
        {place.phone && place.phone !== "No phone available" ? (
          <Text style={styles.link} onPress={() => callNumber(place.phone!)}>
            📞 Call: {place.phone}
          </Text>
        ) : (
          <Text style={styles.meta}>No phone available</Text>
        )}

        {/* Address */}
        {place.address && (
          <Text style={styles.link} onPress={() => openMaps(place.address!)}>
            🗺️ Directions
          </Text>
        )}
      </View>
    ));
  };

  // 🔽 Generate PDF
  const generatePDF = async () => {
    try {
      const htmlContent = `
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1>${destCity}${destCountry ? `, ${destCountry}` : ""}</h1>
            <p><strong>Duration:</strong> ${duration} days</p>
            <p><strong>Dates:</strong> ${
              Array.isArray(tripDates) ? tripDates.join(" - ") : "Flexible"
            }</p>
            <hr />

            ${plan
              .map(
                (day) => `
              <h2>${day.day}</h2>
              <ul>
                ${day.schedule
                  .map(
                    (slot) => `
                  <li>
                    <strong>${slot.time}</strong>
                    <ul>
                      ${slot.options
                        .map(
                          (opt) => `
                        <li>
                          <strong>${opt.name}</strong> - ${opt.description}<br/>
                          ${opt.type ? `Type: ${opt.type}<br/>` : ""}
                          ${opt.priceRange ? `Price: ${opt.priceRange}<br/>` : ""}
                          ${opt.website && opt.website !== "No website available"
                            ? `<a href="${opt.website}">Website</a><br/>`
                            : ""}
                          ${opt.phone && opt.phone !== "No phone available"
                            ? `Phone: ${opt.phone}<br/>`
                            : ""}
                          ${opt.address ? `Address: ${opt.address}<br/>` : ""}
                        </li>
                      `
                        )
                        .join("")}
                    </ul>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            `
              )
              .join("")}

            <hr/>
            <h2>Budget Summary</h2>
            <ul>
              ${Object.keys(budgetSummary)
                .map(
                  (day) => `
                <li>
                  <strong>${day}:</strong> 
                  Estimated: $${budgetSummary[day].estimated} / Budget: $${
                    budgetSummary[day].budget
                  } <br/>
                  Status: ${budgetSummary[day].status}
                </li>
              `
                )
                .join("")}
            </ul>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing not available", `PDF saved at: ${uri}`);
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (err) {
      console.error("PDF generation error:", err);
      Alert.alert("Error", "Failed to generate PDF.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            {destCity}
            {destCountry ? `, ${destCountry}` : ""}
          </Text>
          <Text style={styles.heroSub}>
            {duration} days ·{" "}
            {Array.isArray(tripDates) ? tripDates.join(" - ") : "Flexible"}
          </Text>
        </View>

        {/* Daily Itinerary */}
        {plan.map((day: DayPlan, idx: number) => {
          const isOpen = expandedDays[day.day];
          return (
            <View key={idx} style={styles.dayCard}>
              <Pressable onPress={() => toggleDay(day.day)} style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day.day}</Text>
                <Text style={styles.toggle}>{isOpen ? "−" : "+"}</Text>
              </Pressable>
              {isOpen && (
                <View style={styles.dayContent}>
                  {day.schedule.map((slot, sIdx) => (
                    <View key={sIdx} style={styles.slotSection}>
                      <Text style={styles.section}>🕒 {slot.time}</Text>
                      {renderOptions(slot.options)}
                    </View>
                  ))}

                  {/* Daily budget summary */}
                  {budgetSummary?.[day.day] && (
                    <View style={styles.budgetCard}>
                      <Text style={styles.budgetText}>
                        💵 Estimated Spend: ${budgetSummary[day.day].estimated}
                      </Text>
                      <Text style={styles.budgetStatus}>
                        {budgetSummary[day.day].status}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Trip-wide summary */}
        {budgetSummary?.["total"] && (
          <View style={styles.totalBudgetCard}>
            <Text style={styles.totalBudgetTitle}>💰 Trip Summary</Text>
            <Text style={styles.budgetText}>
              Total Estimated: ${budgetSummary["total"].estimated}
            </Text>
            <Text style={styles.budgetText}>
              Budget: ${budgetSummary["total"].budget}
            </Text>
            <Text style={styles.budgetStatus}>
              {budgetSummary["total"].status}
            </Text>
          </View>
        )}

        {/* Download PDF Button */}
        <Pressable style={styles.pdfButton} onPress={generatePDF}>
          <Text style={styles.pdfText}>⬇️ Download / Share PDF</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16 },
  heroCard: {
    backgroundColor: "#2563eb",
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: "center",
  },
  heroTitle: { fontSize: 24, fontWeight: "700", color: "#fff" },
  heroSub: { fontSize: 16, color: "#e0e7ff", marginTop: 4 },

  dayCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    backgroundColor: "#f9fafb",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#2563eb",
  },
  dayTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  toggle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  dayContent: { padding: 14 },
  section: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    color: "#111",
  },

  slotSection: { marginBottom: 16 },

  placeCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  placeName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  placeDesc: { fontSize: 14, color: "#555", marginBottom: 6 },
  meta: { fontSize: 13, color: "#444", marginBottom: 4 },
  link: {
    fontSize: 14,
    color: "#2563eb",
    textDecorationLine: "underline",
    marginTop: 4,
  },

  budgetCard: {
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  budgetText: { fontSize: 14, fontWeight: "600", color: "#111" },
  budgetStatus: { fontSize: 13, color: "#444", marginTop: 2 },

  totalBudgetCard: {
    backgroundColor: "#dbeafe",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  totalBudgetTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111",
  },

  pdfButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  pdfText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});


