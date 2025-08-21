// src/screens/AuthScreen.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;

export default function AuthScreen({ navigation }: Props) {
  const planeAnim = useRef(new Animated.Value(-100)).current;

  // Animate the plane emoji ✈️ across the screen
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(planeAnim, {
          toValue: 350, // move across screen
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(planeAnim, {
          toValue: -100, // reset to start
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient colors={["#E0F7FA", "#FFFFFF"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* ✈️ Animated plane */}
        <View style={styles.animationContainer}>
          <Animated.Text
            style={[
              styles.plane,
              {
                transform: [{ translateX: planeAnim }],
              },
            ]}
          >
            ✈️
          </Animated.Text>
        </View>

        {/* Title + Subtitle */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to Vayro</Text>
          <Text style={styles.subtitle}>
            Your personalized AI travel assistant.{"\n"}Plan smarter, travel
            easier 🌍
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.button, styles.loginButton]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>🔑 Login</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.signupButton]}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.buttonText}>🆕 Sign Up</Text>
          </Pressable>
        </View>

        {/* Guest Option */}
        <Pressable onPress={() => console.log("Continue as guest")}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  animationContainer: {
    marginTop: 40,
    height: 100,
    width: "100%",
    overflow: "hidden",
  },
  plane: {
    fontSize: 50,
  },
  textContainer: {
    marginTop: -20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: "#1E293B",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#475569",
    lineHeight: 22,
  },
  buttonsContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: "#2563eb",
  },
  signupButton: {
    backgroundColor: "#10b981",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  guestText: {
    marginTop: 20,
    fontSize: 14,
    color: "#64748B",
    textDecorationLine: "underline",
  },
});




