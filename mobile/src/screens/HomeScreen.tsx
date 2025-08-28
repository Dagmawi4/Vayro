import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const topPicks = [
    { city: "Miami", desc: "Beaches & Nightlife 🌴", img: "https://picsum.photos/400/250?1" },
    { city: "Paris", desc: "Love & Lights 🗼", img: "https://picsum.photos/400/250?2" },
    { city: "Tokyo", desc: "Culture & Tech 🏮", img: "https://picsum.photos/400/250?3" },
    { city: "Dubai", desc: "Luxury & Skyline 🌆", img: "https://picsum.photos/400/250?4" },
  ];

  const moods = ["Adventure 🏔️", "Relax 🌊", "Luxury 💎", "Budget 💸"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Greeting */}
        <Text style={styles.welcome}>Welcome back, Dagi 👋</Text>
        <Text style={styles.subtitle}>Ready for your next adventure? Let’s explore!</Text>

        {/* Top Picks Carousel */}
        <Text style={styles.sectionTitle}>✨ Top Picks for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {topPicks.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: item.img }} style={styles.cardImage} />
              <Text style={styles.cardCity}>{item.city}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Explore by Mood */}
        <Text style={styles.sectionTitle}>🌍 Explore by Mood</Text>
        <View style={styles.moodContainer}>
          {moods.map((mood, i) => (
            <Pressable key={i} style={styles.moodButton}>
              <Text style={styles.moodText}>{mood}</Text>
            </Pressable>
          ))}
        </View>

        {/* Nearby Weekend Getaways */}
        <Text style={styles.sectionTitle}>📍 Weekend Getaways Near You</Text>
        <View style={styles.cardRow}>
          <View style={styles.smallCard}>
            <Image source={{ uri: "https://picsum.photos/200/200?5" }} style={styles.smallCardImage} />
            <Text style={styles.cardCity}>Chicago</Text>
            <Text style={styles.cardDesc}>3h Drive • Food & Culture</Text>
          </View>
          <View style={styles.smallCard}>
            <Image source={{ uri: "https://picsum.photos/200/200?6" }} style={styles.smallCardImage} />
            <Text style={styles.cardCity}>Denver</Text>
            <Text style={styles.cardDesc}>2h Flight • Mountains</Text>
          </View>
        </View>

        {/* Big CTA */}
        <Pressable style={styles.planButton} onPress={() => navigation.navigate("Trips")}>
          <Text style={styles.planButtonText}>+ Plan Your Next Adventure</Text>
        </Pressable>
      </ScrollView>

      {/* 🆕 Floating Vira Button */}
      <TouchableOpacity
        style={styles.viraFab}
        onPress={() => navigation.navigate("ViraChat")} // ✅ make sure ViraChatScreen is in your stack
      >
        <Ionicons name="sparkles" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 20 },
  welcome: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 16, color: "#6b7280", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 12 },
  carousel: { marginBottom: 20 },
  card: {
    width: 180,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  cardImage: { width: "100%", height: 100 },
  cardCity: { fontSize: 16, fontWeight: "600", marginTop: 6, marginLeft: 6 },
  cardDesc: { fontSize: 12, color: "#6b7280", marginLeft: 6, marginBottom: 8 },
  moodContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  moodButton: { backgroundColor: "#e0f2fe", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  moodText: { fontSize: 14, color: "#0369a1", fontWeight: "600" },
  cardRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  smallCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  smallCardImage: { width: "100%", height: 100 },
  planButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  planButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // 🆕 FAB Styles
  viraFab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#2563eb",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});


