// src/screens/HelpSupportScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ✅ Enable animation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HelpSupportScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I book a flight?",
      answer:
        "Go to the Flights tab, enter your travel details, and the app will recommend flight options. You can save a recommendation and review it anytime.",
    },
    {
      question: "How do I update my profile?",
      answer:
        "Navigate to Profile > Edit Profile, where you can update your name, email, phone, and profile picture.",
    },
    {
      question: "Can I save trips offline?",
      answer:
        "Currently trips are stored temporarily. Future versions will allow you to save them permanently in your account.",
    },
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.header}>Help & Support</Text>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>FAQs</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleExpand(index)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>
            {expandedIndex === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </View>
        ))}

        {/* Contact Support */}
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => Linking.openURL("mailto:support@vayroapp.com")}
        >
          <Ionicons name="mail-outline" size={22} color="#2563eb" />
          <Text style={styles.optionText}>Email Support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => Linking.openURL("tel:+1234567890")}
        >
          <Ionicons name="call-outline" size={22} color="#2563eb" />
          <Text style={styles.optionText}>Call Support</Text>
        </TouchableOpacity>

        {/* Feedback */}
        <Text style={styles.sectionTitle}>Feedback</Text>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => Linking.openURL("mailto:feedback@vayroapp.com")}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2563eb" />
          <Text style={styles.optionText}>Send Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "700", padding: 16 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  faqCard: {
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: { fontSize: 16, fontWeight: "600", color: "#111827" },
  faqAnswer: { marginTop: 8, fontSize: 14, color: "#374151", lineHeight: 20 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  optionText: { fontSize: 16, marginLeft: 12, color: "#111827" },
});
