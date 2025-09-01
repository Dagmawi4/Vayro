// src/screens/ViraConversationsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "ViraConversations">;

type Message = {
  id: string;
  sender: "user" | "vira";
  text: string;
};

type Conversation = {
  id: string;
  messages: Message[];
  createdAt: string;
};

const STORAGE_KEY = "vira_conversations";

export default function ViraConversationsScreen({ navigation }: Props) {
  const [convos, setConvos] = useState<Conversation[]>([]);

  const loadConvos = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setConvos(parsed);
    } catch (err) {
      console.error("Load convos error:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadConvos);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id: string) => {
    Alert.alert("Delete Conversation", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const updated = convos.filter((c) => c.id !== id);
            setConvos(updated);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch (err) {
            console.error("Delete error:", err);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const preview =
      item.messages.length > 0
        ? (item.messages[0].text.length > 40
            ? item.messages[0].text.slice(0, 40) + "…"
            : item.messages[0].text)
        : "(empty)";

    return (
      <View style={styles.convoCard}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() =>
            navigation.navigate("ViraChat", {
              convoId: item.id,
            })
          }
        >
          <Text style={styles.convoTitle}>
            Conversation · {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.convoPreview}>{preview}</Text>
        </Pressable>

        <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Conversations</Text>
        <Pressable
          style={styles.newChatBtn}
          onPress={() => navigation.navigate("ViraChat", { convoId: undefined })}
        >
          <Ionicons name="add-circle-outline" size={22} color="#2563eb" />
          <Text style={styles.newChatText}>New Chat</Text>
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={convos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No conversations yet. Start a new chat!
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  newChatBtn: { flexDirection: "row", alignItems: "center" },
  newChatText: { marginLeft: 6, color: "#2563eb", fontWeight: "600" },
  convoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  convoTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  convoPreview: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  deleteBtn: { marginLeft: 12, padding: 4 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#6b7280" },
});

