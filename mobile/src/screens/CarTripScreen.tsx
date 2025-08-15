// src/screens/CarTripScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CarTripScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { city } = route.params as { city: string };

  const [destinationAddress, setDestinationAddress] = useState('');
  const [eta, setEta] = useState('');

  const handleArrived = () => {
    if (!destinationAddress || !eta) {
      alert('Please fill out all fields');
      return;
    }

    // Navigate directly to PrefsScreen (Trip Setup 2)
    navigation.navigate('PrefsScreen' as never, {
      airport: '', // Not needed for car trips
      destination: destinationAddress,
      eta: eta,
      mode: 'car'
    } as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Car Trip Details</Text>

      <Text style={styles.label}>Destination Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={destinationAddress}
        onChangeText={setDestinationAddress}
      />

      <Text style={styles.label}>Estimated Time of Arrival</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2:30 PM"
        value={eta}
        onChangeText={setEta}
      />

      <Pressable style={styles.button} onPress={handleArrived}>
        <Text style={styles.buttonText}>Arrived at Destination</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

