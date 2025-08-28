// src/screens/AboutAppScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ✅ Import app logo from assets
import appLogo from "../../assets/vayro-logo.png"; // replace with your logo later

export default function AboutAppScreen() {
  const appVersion = "1.0.0";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <Text style={styles.header}>About This App</Text>

        {/* Logo + Name */}
        <View style={styles.logoContainer}>
          <Image source={appLogo} style={styles.logo} />
          <Text style={styles.appName}>Vayro</Text>
          <Text style={styles.tagline}>Your AI-powered travel assistant ✈️</Text>
        </View>

        {/* Version */}
        <Text style={styles.version}>Version {appVersion}</Text>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            Vayro helps you plan trips smarter — from flights to itineraries —
            powered by AI. Save your recommendations, explore new destinations,
            and stay on top of every detail in one place.
          </Text>
        </View>

        {/* Links Section */}
        <Text style={styles.sectionTitle}>More</Text>
        <OptionRow
          icon="document-text-outline"
          label="Privacy Policy"
          onPress={() => Linking.openURL("https://example.com/privacy")}
        />
        <OptionRow
          icon="shield-checkmark-outline"
          label="Terms of Service"
          onPress={() => Linking.openURL("https://example.com/terms")}
        />
        <OptionRow
          icon="star-outline"
          label="Rate this App"
          onPress={() => Linking.openURL("https://example.com/rate")}
        />
        <OptionRow
          icon="globe-outline"
          label="Visit Website"
          onPress={() => Linking.openURL("https://example.com")}
        />

        {/* Credits */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with ❤️ by{" "}
            <Text style={{ fontWeight: "700", color: "#2563eb" }}>
              Dagmawi Abera
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ✅ Reusable Option Row
function OptionRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#374151" style={{ marginRight: 12 }} />
      <Text style={styles.optionText}>{label}</Text>
      <Ionicons
        name="chevron-forward"
        size={20}
        color="#9ca3af"
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "700", padding: 16 },
  logoContainer: { alignItems: "center", marginVertical: 20 },
  logo: { width: 100, height: 100, borderRadius: 20, marginBottom: 12 },
  appName: { fontSize: 22, fontWeight: "700", color: "#111827" },
  tagline: { fontSize: 14, color: "#6b7280", marginTop: 4, textAlign: "center" },
  version: {
    textAlign: "center",
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 20,
  },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionText: { fontSize: 15, color: "#374151", lineHeight: 22, textAlign: "center" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  optionText: { fontSize: 16, color: "#111827" },
  footer: { marginTop: 30, alignItems: "center" },
  footerText: { fontSize: 14, color: "#6b7280" },
});

