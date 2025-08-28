import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

// ✅ Import app logo from assets
import appLogo from "../../assets/vayro-logo.png";

const { width: screenWidth } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;

export default function AuthScreen({ navigation }: Props) {
  const planeAnim = useRef(new Animated.Value(-120)).current;
  const cloud1Anim = useRef(new Animated.Value(-200)).current;
  const cloud2Anim = useRef(new Animated.Value(screenWidth)).current;

  // Animate plane across screen
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(planeAnim, {
          toValue: screenWidth + 120,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(planeAnim, {
          toValue: -120,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animate clouds drifting slowly
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cloud1Anim, {
          toValue: screenWidth,
          duration: 18000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(cloud1Anim, {
          toValue: -200,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(cloud2Anim, {
          toValue: -200,
          duration: 22000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(cloud2Anim, {
          toValue: screenWidth,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={["#E0F7FA", "#FFFFFF"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image source={appLogo} style={styles.logo} />

          {/* Clouds below logo */}
          <Animated.Text
            style={[
              styles.cloud,
              { transform: [{ translateX: cloud1Anim }] },
              { top: 150 },
            ]}
          >
            ☁️
          </Animated.Text>
          <Animated.Text
            style={[
              styles.cloud,
              { transform: [{ translateX: cloud2Anim }] },
              { top: 190 },
            ]}
          >
            ☁️
          </Animated.Text>

          {/* Plane below clouds */}
          <Animated.Text
            style={[
              styles.plane,
              { transform: [{ translateX: planeAnim }] },
            ]}
          >
            ✈️
          </Animated.Text>
        </View>

        {/* Info Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to Vayro</Text>
          <Text style={styles.subtitle}>
            Your AI-powered travel assistant 🌍{"\n"}
            Plan smarter, travel easier.
          </Text>
        </View>

        {/* Actions Section */}
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
            <Text style={styles.buttonText}>✨ Sign Up</Text>
          </Pressable>

          <Pressable onPress={() => console.log("Continue as guest")}>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Powered by AI ✨</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  hero: {
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    height: 200,
    justifyContent: "flex-start",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 20,
  },
  plane: {
    fontSize: 50,
    position: "absolute",
    top: 230, // ✅ moved plane lower
  },
  cloud: {
    fontSize: 40,
    position: "absolute",
    opacity: 0.5, // ✅ lighter so it doesn’t overpower
  },
  textContainer: {
    alignItems: "center",
    marginTop: -10,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 40,
  },
  button: {
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButton: { backgroundColor: "#2563eb" },
  signupButton: { backgroundColor: "#10b981" },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  guestText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  footer: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 10,
  },
});








