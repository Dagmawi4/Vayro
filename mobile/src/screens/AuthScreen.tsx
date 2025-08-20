// src/screens/AuthScreen.tsx
import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;

export default function AuthScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Vayro</Text>
      <Text style={styles.subtitle}>
        Your personalized AI travel assistant.{"\n"}Land and enjoy your trip ✈️
      </Text>

      <View style={styles.buttonsContainer}>
        {/* ✅ Go to LoginScreen */}
        <Pressable
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        {/* ✅ Go to SignupScreen */}
        <Pressable
          style={[styles.button, styles.signupButton]}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonsContainer: {
    gap: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#2563eb",
  },
  signupButton: {
    backgroundColor: "#10b981",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});


