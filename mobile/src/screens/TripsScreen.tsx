import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Trips'>;

const mockTrips = [
  { id: '1', city: 'Miami, FL', dates: 'Apr 25–28', mood: 'Chill' },
  { id: '2', city: 'Las Vegas, NV', dates: 'May 4–6', mood: 'Adventure' },
];

export default function TripsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Trips</Text>

      <FlatList
        data={mockTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.city}</Text>
            <Text style={styles.cardSub}>{item.dates} • {item.mood}</Text>
          </View>
        )}
      />

      <Pressable style={styles.fab} onPress={() => {/* TODO: Add Trip flow */}}>
        <Text style={styles.fabText}>＋ Add Trip</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSub: { color: '#6b7280', marginTop: 2 },
  fab: { backgroundColor: '#2563eb', padding: 14, borderRadius: 9999, alignSelf: 'center', marginTop: 16, paddingHorizontal: 20 },
  fabText: { color: '#fff', fontWeight: '700' },
});
