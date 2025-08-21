import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getPriceEstimate } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'TransportOptions'>;
type Mode = 'uberlyft' | 'shuttle' | 'rental' | 'friend';

export default function TransportOptionsScreen({ route, navigation }: Props) {
  const {
    departCountry = '',
    departCity = '',
    destCountry = '',
    destCity = '',
    mode: initialMode = 'uberlyft',
    airport = '',
    destination = '',
  } = route.params || {};

  const [mode, setMode] = useState<Mode>(initialMode as Mode);
  const [loading, setLoading] = useState(true);
  const [est, setEst] = useState<{ uber: number; lyft: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (mode !== 'uberlyft') {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    getPriceEstimate(departCity, destCity)
      .then((d) => mounted && setEst(d))
      .catch(() => mounted && setError('Could not load estimates'))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [mode, departCity, destCity]);

  function handleArrived() {
    navigation.navigate('PrefsScreen', {
      departCountry,
      departCity,
      destCountry,
      destCity,
      mode,
    });
  }

  function renderDetails() {
    if (mode === 'uberlyft') {
      if (loading) return <ActivityIndicator />;
      if (error) return <Text style={styles.error}>{error}</Text>;
      if (!est) return null;

      return (
        <View style={styles.stack}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>UberX (est.)</Text>
            <Text style={styles.price}>${est.uber.toFixed(2)}</Text>
            <Text style={styles.note}>Pickup: Arrivals, Door 3 (mock)</Text>
            <Text style={styles.note}>ETA: ~7 min • Driver: Toyota Camry</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lyft (est.)</Text>
            <Text style={styles.price}>${est.lyft.toFixed(2)}</Text>
            <Text style={styles.note}>Pickup: Arrivals, Door 5 (mock)</Text>
            <Text style={styles.note}>ETA: ~5 min • Driver: Honda Accord</Text>
          </View>
        </View>
      );
    }

    if (mode === 'shuttle') {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Airport Shuttle</Text>
          <Text style={styles.note}>Blue Line Shuttle • ~$12/person • every 30 min</Text>
          <Text style={styles.note}>Pickup: Terminal B, Island 2 (mock)</Text>
          <Text style={styles.note}>First shuttle 6:00 AM, last 11:30 PM</Text>
          <Text style={styles.note}>Pay onboard • Card accepted</Text>
        </View>
      );
    }

    if (mode === 'rental') {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Car Rental</Text>
          <Text style={styles.note}>Enterprise Rentals • ~$45/day (economy)</Text>
          <Text style={styles.note}>Shuttle to Rental Center every 10 min</Text>
          <Text style={styles.note}>Location: Rental Center, Level 2 (mock)</Text>
          <Text style={styles.note}>Bring license & credit card</Text>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Friend / Family Pickup</Text>
        <Text style={styles.note}>Meet at Arrivals curbside • Share your flight/terminal</Text>
        <Text style={styles.note}>Tip: Use the airport’s “Cell Phone Lot” if they arrive early</Text>
        <Text style={styles.note}>Call/Text once you’ve collected bags</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transport Options</Text>
        <Text style={styles.sub}>
          {departCity || 'Origin'} → {destCity || 'Destination'}
        </Text>
        <Text style={styles.destText}>
          Arrival Airport: {airport || 'N/A'}
        </Text>
        <Text style={styles.destText}>
          Destination Address: {destination || 'N/A'}
        </Text>
      </View>

      <View style={styles.row}>
        <Pressable
          style={[styles.chip, mode === 'uberlyft' && styles.chipOn]}
          onPress={() => setMode('uberlyft')}
        >
          <Text style={[styles.chipText, mode === 'uberlyft' && styles.chipTextOn]}>Uber/Lyft</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, mode === 'shuttle' && styles.chipOn]}
          onPress={() => setMode('shuttle')}
        >
          <Text style={[styles.chipText, mode === 'shuttle' && styles.chipTextOn]}>Shuttle</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, mode === 'rental' && styles.chipOn]}
          onPress={() => setMode('rental')}
        >
          <Text style={[styles.chipText, mode === 'rental' && styles.chipTextOn]}>Car Rental</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, mode === 'friend' && styles.chipOn]}
          onPress={() => setMode('friend')}
        >
          <Text style={[styles.chipText, mode === 'friend' && styles.chipTextOn]}>Friend/Family</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 12 }}>{renderDetails()}</View>

      <View style={{ height: 12 }} />
      <Pressable style={styles.button} onPress={handleArrived}>
        <Text style={styles.buttonText}>Arrived at Destination</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  sub: {
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
    fontSize: 16,
  },
  destText: {
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 15,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 4,
  },
  chipOn: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    color: '#111827',
    fontWeight: '600',
  },
  chipTextOn: {
    color: '#fff',
  },
  stack: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  price: {
    fontSize: 16,
    marginTop: 4,
  },
  note: {
    color: '#6b7280',
    marginTop: 4,
  },
  error: {
    color: '#b91c1c',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});





