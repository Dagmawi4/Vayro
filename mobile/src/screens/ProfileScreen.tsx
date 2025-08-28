// src/screens/ProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

// ✅ Import local profile image from assets
import profilePic from "../../assets/Profile.jpeg";

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const user = {
    name: "Dagmawi Abera",
    email: "dagmawi.abera@outlook.com",
    memberSince: "Joined August 2025",
  };

  function handleLogout() {
    // ✅ Reset navigation stack and go to AuthScreen
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <Text style={styles.header}>My Profile</Text>

        {/* User Info Card */}
        <View style={styles.profileCard}>
          <Image source={profilePic} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.memberSince}>{user.memberSince}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Options List */}
        <View style={styles.section}>
          <OptionRow
            icon="person-circle-outline"
            label="Edit Profile"
            onPress={() => navigation.navigate("EditProfile")}
          />
          <OptionRow
            icon="settings-outline"
            label="Settings"
            onPress={() => navigation.navigate("Settings")}
          />
          <OptionRow
            icon="notifications-outline"
            label="Notifications"
            onPress={() => navigation.navigate("Notifications")}
          />
          <OptionRow
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => navigation.navigate("HelpSupport")}
          />
          <OptionRow
            icon="information-circle-outline"
            label="About App"
            onPress={() => navigation.navigate("AboutApp")}
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
      <Ionicons
        name={icon}
        size={22}
        color="#374151"
        style={{ marginRight: 12 }}
      />
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
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#2563eb",
  },
  name: { fontSize: 20, fontWeight: "700", color: "#111827" },
  email: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  memberSince: { fontSize: 12, color: "#9ca3af", marginTop: 4 },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
    marginBottom: 16,
  },
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

export default ProfileScreen;



