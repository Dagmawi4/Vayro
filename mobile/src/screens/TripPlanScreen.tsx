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

type Props = NativeStackScreenProps<RootStackParamList, 'TripPlan'>;

export default function TripPlanScreen({ route }: Props) {
  const {
    airport,
    destination,
    mode,
    duration,
    budget,
    mood,
    food,
    activities,
    commitments
  } = route.params;

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      // Simulated AI-generated itinerary
      const mockPlan = [
        `Day 1: Arrive in ${destination} via ${mode === 'car' ? 'car trip' : `flight to ${airport}`}. Settle into hotel and enjoy a casual dinner featuring ${food}.`,
        `Day 2: Morning sightseeing based on your mood (${mood}). Afternoon activity: ${activities}.`,
        `Day 3: Explore local favorites, including hidden gems that fit your budget of ${budget}.`,
        commitments !== 'None'
          ? `Note: You have pre-scheduled commitments — ${commitments} — factored into your itinerary.`
          : `Enjoy a fully flexible day without pre-scheduled commitments.`,
        `Day ${duration}: Wrap up with relaxing activities and prep for departure.`
      ];
      setPlan(mockPlan);
      setLoading(false);
    }, 2500); // simulate AI thinking
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Trip Plan</Text>
      <Text style={styles.sub}>
        Personalized for {destination} ({duration} days)
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Generating your personalized itinerary...</Text>
        </View>
      ) : (
        <ScrollView style={styles.planContainer}>
          {plan.map((item, index) => (
            <View key={index} style={styles.planItem}>
              <Text style={styles.planText}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  sub: { fontSize: 16, color: '#6b7280', marginBottom: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#6b7280' },
  planContainer: { marginTop: 10 },
  planItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  planText: { fontSize: 16, lineHeight: 22 }
});
