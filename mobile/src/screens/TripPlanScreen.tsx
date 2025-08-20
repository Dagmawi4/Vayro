import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  View
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { OPENAI_API_KEY } from "@env";

type Props = NativeStackScreenProps<RootStackParamList, 'TripPlan'>;

export default function TripPlanScreen({ route }: Props) {
  const { 
    departCity, 
    departCountry, 
    destCity, 
    destCountry, 
    mode, 
    duration, 
    budget, 
    mood, 
    food, 
    activities, 
    travelSolo,
    commitments, 
    visitedBefore, 
    tripDates
  } = route.params;

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("");

  const fetchItinerary = async () => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a professional travel assistant.
Generate a complete, personalized travel itinerary with:
- No markdown (**bold**, *, etc).
- Use clear section headers (Day 1, Morning, Afternoon, Evening).
- Include specific and real recommendations (actual restaurants, hotels, attractions, events).
- Each section should have detailed suggestions, not generic lines like "eat local food."
- Write naturally, like ChatGPT would when giving advice. Use emojis for vibe (🌞, 🍴, 🏨, 🎉, ✈️, 🌙, etc).`
            },
            {
              role: "user",
              content: `Plan a detailed ${duration}-day trip to ${destCity}, ${destCountry}.
Mode: ${mode === 'car' ? 'Car trip' : `Flight from ${departCity}, ${departCountry}`}
Budget: ${budget}
Mood: ${mood}
Food preferences: ${food}
Activities: ${activities}
Travel style: ${travelSolo}
Commitments: ${Array.isArray(commitments) && commitments.length ? commitments.join(", ") : "None"}
Visited before: ${Array.isArray(visitedBefore) && visitedBefore.length ? visitedBefore.join(", ") : "No"}
Trip dates: ${Array.isArray(tripDates) && tripDates.length ? tripDates.join(" to ") : "Flexible"}

Make it feel real and customized, with specific names of places, attractions, and experiences.`
            }
          ],
          temperature: 0.9
        }),
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) setPlan(text);
      else setPlan("⚠️ Could not generate plan.");
    } catch (error) {
      console.error(error);
      setPlan("❌ Error generating itinerary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, []);

  // formatter: removes asterisks + adds styling
  const renderPlan = (text: string) => {
    return text.split("\n").map((line, idx) => {
      if (line.toLowerCase().startsWith("day")) {
        return <Text key={idx} style={styles.day}>{line}</Text>;
      } else if (line.toLowerCase().startsWith("morning")) {
        return <Text key={idx} style={styles.section}>🌞 {line}</Text>;
      } else if (line.toLowerCase().startsWith("afternoon")) {
        return <Text key={idx} style={styles.section}>🌆 {line}</Text>;
      } else if (line.toLowerCase().startsWith("evening")) {
        return <Text key={idx} style={styles.section}>🌙 {line}</Text>;
      } else if (line.startsWith("-")) {
        return <Text key={idx} style={styles.bullet}>• {line.replace("-", "").trim()}</Text>;
      } else {
        return <Text key={idx} style={styles.text}>{line}</Text>;
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Trip Plan</Text>
      <Text style={styles.sub}>
        Personalized itinerary for {destCity}, {destCountry} ({duration} days)
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Generating your personalized itinerary...</Text>
        </View>
      ) : (
        <ScrollView style={styles.planContainer}>
          {plan ? renderPlan(plan) : <Text style={{ color: 'red' }}>⚠️ No itinerary generated.</Text>}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4, color: '#111' },
  sub: { fontSize: 16, color: '#6b7280', marginBottom: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#6b7280' },
  planContainer: { marginTop: 10 },
  day: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 6, color: '#2563eb' },
  section: { fontSize: 18, fontWeight: '600', marginTop: 10, color: '#111' },
  bullet: { fontSize: 16, marginLeft: 16, marginTop: 4, lineHeight: 22 },
  text: { fontSize: 16, lineHeight: 22 }
});






