// src/screens/NotificationsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Notification = {
  id: string;
  type: "flight" | "trip" | "app";
  title: string;
  description: string;
  time: string;
};

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // Example notifications data (could later come from API)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "flight",
      title: "Flight Update",
      description: "Your flight ADD → MSP is delayed by 1h 20m.",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "trip",
      title: "Trip Reminder",
      description: "Your trip to Paris starts tomorrow ✈️",
      time: "Yesterday",
    },
    {
      id: "3",
      type: "app",
      title: "New Feature",
      description: "You can now save multiple flight recommendations!",
      time: "2 days ago",
    },
  ]);

  // Simulate refreshing
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Example: prepend a "new" notification
      setNotifications((prev) => [
        {
          id: Math.random().toString(),
          type: "app",
          title: "Welcome Back",
          description: "You’re all caught up with the latest updates.",
          time: "Just now",
        },
        ...prev,
      ]);
      setRefreshing(false);
    }, 1500);
  };

  // Icons based on type
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "flight":
        return "airplane";
      case "trip":
        return "map-outline";
      case "app":
        return "information-circle-outline";
      default:
        return "notifications-outline";
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.card}>
      <Ionicons
        name={getIcon(item.type) as any}
        size={28}
        color="#2563eb"
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyText}>No notifications yet 📭</Text>
          <Text style={styles.emptySub}>
            Updates about your flights and trips will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "700",
    padding: 16,
    marginBottom: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 2, color: "#111827" },
  description: { fontSize: 14, color: "#374151", marginBottom: 4 },
  time: { fontSize: 12, color: "#9ca3af" },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyText: { fontSize: 18, fontWeight: "600", marginTop: 12, color: "#111827" },
  emptySub: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
});
