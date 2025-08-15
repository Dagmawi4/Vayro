import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTrip'>;

export default function AddTripScreen({ navigation }: Props) {
  const [city, setCity] = useState('');
  const [mode, setMode] = useState<'air' | 'car' | undefined>();

  function handleNext() {
    if (mode === 'air') {
      // Go to Airport flow to collect airport + destination details
      navigation.navigate('Airport', { city }); // pass city if Airport screen needs it
    } else if (mode === 'car') {
      // Go to Car Trip flow to collect destination details & ETA
      navigation.navigate('CarTrip', { city });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add Trip</Text>

      <Text style={styles.label}>Destination City</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Miami, FL"
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>How are you getting there?</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.chip, mode === 'air' && styles.chipOn]}
          onPress={() => setMode('air')}
        >
          <Text style={[styles.chipText, mode === 'air' && styles.chipTextOn]}>Air</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, mode === 'car' && styles.chipOn]}
          onPress={() => setMode('car')}
        >
          <Text style={[styles.chipText, mode === 'car' && styles.chipTextOn]}>Car</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.button, (!city || !mode) && { opacity: 0.6 }]}
        onPress={handleNext}
        disabled={!city || !mode}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, fontSize: 16 },
  row: { flexDirection: 'row', gap: 10 },
  chip: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 24, paddingVertical: 10, paddingHorizontal: 16 },
  chipOn: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { color: '#111827', fontWeight: '600' },
  chipTextOn: { color: '#fff' },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 12, marginTop: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

