// src/screens/SettingsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  // State for toggles
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [flightUpdates, setFlightUpdates] = useState(true);
  const [tripReminders, setTripReminders] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(false);

  function handleChangePassword() {
    Alert.alert("Change Password", "Redirecting to change password flow...");
  }

  function handleCurrencySelect() {
    Alert.alert("Currency", "Currency selection coming soon!");
  }

  function handleLanguageSelect() {
    Alert.alert("Language", "Language selection coming soon!");
  }

  function handleOpenLink(title: string) {
    Alert.alert(title, `Open ${title} page...`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.header}>Settings</Text>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <OptionRow
          icon="key-outline"
          label="Change Password"
          onPress={handleChangePassword}
        />
        <OptionRow
          icon="mail-outline"
          label="Manage Email / Phone"
          onPress={() => Alert.alert("Account", "Manage account details")}
        />

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <ToggleRow
          icon="moon-outline"
          label="Dark Mode"
          value={darkMode}
          onValueChange={setDarkMode}
        />
        <OptionRow
          icon="cash-outline"
          label="Currency"
          onPress={handleCurrencySelect}
          rightText="USD"
        />
        <OptionRow
          icon="language-outline"
          label="Language"
          onPress={handleLanguageSelect}
          rightText="English"
        />

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <ToggleRow
          icon="notifications-outline"
          label="Push Notifications"
          value={pushNotifications}
          onValueChange={setPushNotifications}
        />
        <ToggleRow
          icon="airplane-outline"
          label="Flight Updates"
          value={flightUpdates}
          onValueChange={setFlightUpdates}
        />
        <ToggleRow
          icon="map-outline"
          label="Trip Reminders"
          value={tripReminders}
          onValueChange={setTripReminders}
        />

        {/* Security */}
        <Text style={styles.sectionTitle}>Security & Privacy</Text>
        <ToggleRow
          icon="finger-print-outline"
          label="Biometric Login (FaceID/TouchID)"
          value={biometricLogin}
          onValueChange={setBiometricLogin}
        />
        <OptionRow
          icon="document-text-outline"
          label="Privacy Policy"
          onPress={() => handleOpenLink("Privacy Policy")}
        />
        <OptionRow
          icon="shield-checkmark-outline"
          label="Terms of Service"
          onPress={() => handleOpenLink("Terms of Service")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ✅ Reusable Row with Icon + Label + Chevron
function OptionRow({
  icon,
  label,
  onPress,
  rightText,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  rightText?: string;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#374151" style={{ marginRight: 12 }} />
      <Text style={styles.label}>{label}</Text>
      {rightText && <Text style={styles.rightText}>{rightText}</Text>}
      <Ionicons
        name="chevron-forward"
        size={20}
        color="#9ca3af"
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  );
}

// ✅ Reusable Row with a Toggle (Switch)
function ToggleRow({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color="#374151" style={{ marginRight: 12 }} />
      <Text style={styles.label}>{label}</Text>
      <Switch
        style={{ marginLeft: "auto" }}
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? "#2563eb" : "#f4f3f4"}
        trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
      />
    </View>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  label: { fontSize: 16, color: "#111827" },
  rightText: { fontSize: 14, color: "#6b7280", marginLeft: "auto", marginRight: 6 },
});
