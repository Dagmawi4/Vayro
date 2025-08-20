import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getHealth } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Trips'>;

const mockTrips = [
  { id: '1', city: 'Miami, FL', dates: 'Apr 25–28', mood: 'Chill' },
  { id: '2', city: 'Las Vegas, NV', dates: 'May 4–6', mood: 'Adventure' },
];

export default function TripsScreen({ navigation }: Props) {
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'fail'>('checking');

  useEffect(() => {
    let mounted = true;
    getHealth()
      .then((d) => mounted && setApiStatus(d.ok ? 'ok' : 'fail'))
      .catch(() => mounted && setApiStatus('fail'));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Your Trips</Text>
        <View
          style={[
            styles.badge,
            apiStatus === 'ok' ? styles.badgeOk : apiStatus === 'fail' ? styles.badgeFail : styles.badgeChecking,
          ]}
        >
          <Text style={styles.badgeText}>
            API: {apiStatus === 'checking' ? 'checking…' : apiStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      <FlatList
        data={mockTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.city}</Text>
            <Text style={styles.cardSub}>
              {item.dates} • {item.mood}
            </Text>
          </View>
        )}
      />

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddTrip')}
      >
        <Text style={styles.fabText}>＋ Add Trip</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700' },

  badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9999 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  badgeOk: { backgroundColor: '#16a34a' },
  badgeFail: { backgroundColor: '#b91c1c' },
  badgeChecking: { backgroundColor: '#6b7280' },

  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSub: { color: '#6b7280', marginTop: 2 },

  fab: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 9999,
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  fabText: { color: '#fff', fontWeight: '700' },
});
