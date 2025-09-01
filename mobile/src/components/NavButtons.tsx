// src/components/NavButtons.tsx
import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App"; 
import { Ionicons } from "@expo/vector-icons";

export default function NavButtons() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#2563eb" />
      </Pressable>

      {/* Home Button */}
      <Pressable
        style={styles.iconButton}
        onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
      >
        <Ionicons name="home" size={24} color="#2563eb" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconButton: {
    padding: 8, // increases touch target without background
  },
});

