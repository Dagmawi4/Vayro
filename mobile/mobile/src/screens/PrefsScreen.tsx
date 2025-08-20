// src/screens/PrefsScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  View,
  Switch,
  ScrollView
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'PrefsScreen'>;

export default function PrefsScreen({ navigation, route }: Props) {
  const { airport, destination, mode } = route.params;

  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [mood, setMood] = useState<'vacation' | 'business' | ''>('');
  const [food, setFood] = useState('');
  const [activities, setActivities] = useState('');
  const [hasCommitments, setHasCommitments] = useState(false);
  const [commitments, setCommitments] = useState('');

const handlePlanTrip = () => {
  navigation.navigate('TripPlan', {
    airport,
    destination,
    mode,
    duration,
    budget,
    mood,
    food,
    activities,
    commitments: hasCommitments ? commitments : 'None'
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.title}>Plan your trip</Text>
        <Text style={styles.sub}>
          Tell us more about your trip so we can customize your plan..
        </Text>

        {/* Duration */}
        <Text style={styles.label}>Trip Duration (days)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 5"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />

        {/* Budget */}
        <Text style={styles.label}>Budget ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 1000"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />

        {/* Mood */}
        <Text style={styles.label}>Mood</Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.chip, mood === 'vacation' && styles.chipOn]}
            onPress={() => setMood('vacation')}
          >
            <Text
              style={[
                styles.chipText,
                mood === 'vacation' && styles.chipTextOn
              ]}
            >
              Vacation
            </Text>
          </Pressable>
          <Pressable
            style={[styles.chip, mood === 'business' && styles.chipOn]}
            onPress={() => setMood('business')}
          >
            <Text
              style={[
                styles.chipText,
                mood === 'business' && styles.chipTextOn
              ]}
            >
              Business
            </Text>
          </Pressable>
        </View>

        {/* Food */}
        <Text style={styles.label}>Food Preferences</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Seafood, Vegan"
          value={food}
          onChangeText={setFood}
        />

        {/* Activities */}
        <Text style={styles.label}>Desired Activities</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Museums, Hiking"
          value={activities}
          onChangeText={setActivities}
        />

        {/* Commitments */}
        <View style={styles.commitmentsHeader}>
          <Text style={styles.label}>Any fixed commitments?</Text>
          <Switch
            value={hasCommitments}
            onValueChange={setHasCommitments}
            trackColor={{ false: '#d1d5db', true: '#2563eb' }}
            thumbColor="#fff"
          />
        </View>
        {hasCommitments && (
          <TextInput
            style={styles.input}
            placeholder="Describe your meetings/work times"
            value={commitments}
            onChangeText={setCommitments}
          />
        )}

        {/* Button */}
        <Pressable style={styles.button} onPress={handlePlanTrip}>
          <Text style={styles.buttonText}>Plan My Trip</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  sub: { color: '#6b7280', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16
  },
  row: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  chip: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  chipOn: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { color: '#111827', fontWeight: '600' },
  chipTextOn: { color: '#fff' },
  commitmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: '700' }
});
