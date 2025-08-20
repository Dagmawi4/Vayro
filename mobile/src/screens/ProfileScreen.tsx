import React from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const user = {
    name: "Dagmawi Abera",
    email: "dagmawi.abera@outlook.com",
    avatar: "https://i.pravatar.cc/150?img=3", // placeholder profile pic
  };

  function handleEditProfile() {
    console.log("Edit profile tapped");
  }

  function handleSettings() {
    console.log("Settings tapped");
  }

  function handleLogout() {
    console.log("Logout tapped");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <Text style={styles.header}>My Profile</Text>

        {/* User Info Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          <Pressable onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={22} color="#2563eb" />
          </Pressable>
        </View>

        {/* Options List */}
        <View style={styles.section}>
          <OptionRow
            icon="person-circle-outline"
            label="Edit Profile"
            onPress={handleEditProfile}
          />
          <OptionRow
            icon="settings-outline"
            label="Settings"
            onPress={handleSettings}
          />
          <OptionRow
            icon="notifications-outline"
            label="Notifications"
            onPress={() => console.log("Notifications tapped")}
          />
          <OptionRow
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => console.log("Help tapped")}
          />
          <OptionRow
            icon="information-circle-outline"
            label="About App"
            onPress={() => console.log("About tapped")}
          />
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    <Pressable style={styles.optionRow} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#374151" style={{ marginRight: 12 }} />
      <Text style={styles.optionText}>{label}</Text>
      <Ionicons
        name="chevron-forward"
        size={20}
        color="#9ca3af"
        style={{ marginLeft: "auto" }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "700", padding: 16 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  name: { fontSize: 18, fontWeight: "600", color: "#111827" },
  email: { fontSize: 14, color: "#6b7280" },
  section: { marginHorizontal: 16, marginBottom: 24 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: { fontSize: 16, color: "#111827" },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    padding: 14,
    marginHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
