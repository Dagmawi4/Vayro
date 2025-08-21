import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type WishlistItem = {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
};

export default function WishlistScreen() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: "1",
      title: "Trip to Paris",
      subtitle: "Eiffel Tower, museums, cafés",
      image: "https://source.unsplash.com/600x400/?paris",
    },
    {
      id: "2",
      title: "Hiking in Colorado",
      subtitle: "Rocky Mountain adventure",
      image: "https://source.unsplash.com/600x400/?mountains",
    },
    {
      id: "3",
      title: "Tokyo Food Tour",
      subtitle: "Sushi, ramen & street food",
      image: "https://source.unsplash.com/600x400/?tokyo,food",
    },
  ]);

  function handleRemove(item: WishlistItem) {
    Alert.alert(
      "Remove from Wishlist",
      `Are you sure you want to remove "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            setWishlist((prev) => prev.filter((trip) => trip.id !== item.id)),
        },
      ]
    );
  }

  function handleAdd() {
    const newTrip: WishlistItem = {
      id: Date.now().toString(),
      title: "New Dream Trip",
      subtitle: "Tap to edit details",
      image: "https://source.unsplash.com/600x400/?travel",
    };
    setWishlist((prev) => [newTrip, ...prev]);
  }

  function renderItem({ item }: { item: WishlistItem }) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={() => console.log("Tapped:", item.title)}
        onLongPress={() => handleRemove(item)}
      >
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.cardImage} />
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#9ca3af" style={{ marginRight: 10 }} />
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Wishlist</Text>

      {wishlist.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="airplane" size={52} color="#9ca3af" />
          <Text style={styles.emptyText}>No trips saved yet</Text>
          <Text style={styles.emptySubText}>
            Tap the ➕ button to add your dream trips.
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        />
      )}

      {/* Floating Add Button */}
      <Pressable style={styles.fab} onPress={handleAdd}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: Platform.OS === "ios" ? 10 : 20,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  cardSubtitle: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#374151", marginTop: 12 },
  emptySubText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#2563eb",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
});

