import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Airport'>;

export default function AirportScreen({ navigation }: Props) {
  const [airport, setAirport] = useState('');
  const [destination, setDestination] = useState('');

  function handleSeeOptions() {
    navigation.navigate('TransportOptions', { airport, destination });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Arrival Details</Text>

      <Text style={styles.label}>Airport</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., MIA — Miami International"
        value={airport}
        onChangeText={setAirport}
      />

      <Text style={styles.label}>Destination (hotel/Airbnb)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 123 Ocean Dr, Miami Beach"
        value={destination}
        onChangeText={setDestination}
      />

      <Pressable
        style={[styles.button, (!airport || !destination) && { opacity: 0.6 }]}
        disabled={!airport || !destination}
        onPress={handleSeeOptions}
      >
        <Text style={styles.buttonText}>See Transport Options</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16, gap:12 },
  title:{ fontSize:24, fontWeight:'700', marginBottom:8 },
  label:{ fontSize:14, fontWeight:'600' },
  input:{ borderWidth:1, borderColor:'#e5e7eb', borderRadius:12, padding:12, fontSize:16 },
  button:{ backgroundColor:'#2563eb', padding:14, borderRadius:12, marginTop:8, alignItems:'center' },
  buttonText:{ color:'#fff', fontWeight:'700' },
});
