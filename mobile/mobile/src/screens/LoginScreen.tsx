import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  function handleContinue() {
    // TODO: real auth later (Firebase)
    navigation.replace('Trips');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Vayro</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
      />

      <Text style={styles.or}>or</Text>

      <Text style={styles.label}>Phone (for code login)</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholder="+1 555 123 4567"
      />

      <Pressable style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, fontSize: 16 },
  or: { textAlign: 'center', color: '#888', marginVertical: 8 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 12, marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: '600' },
});
