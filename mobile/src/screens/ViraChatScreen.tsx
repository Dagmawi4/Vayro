// src/screens/ViraChatScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Markdown from "react-native-markdown-display";   // ✅ Markdown support
import { API_BASE } from "../api/config";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "ViraChat">;

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

export default function ViraChatScreen({ navigation, route }: Props) {
  const { convoId } = route.params || {}; // if null → new chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(
    convoId || null
  );
  const flatListRef = useRef<FlatList>(null);

  // Load existing convo if reopened
  useEffect(() => {
    const loadConvo = async () => {
      try {
        if (activeConvoId) {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          const parsed: Conversation[] = stored ? JSON.parse(stored) : [];
          const convo = parsed.find((c) => c.id === activeConvoId);
          if (convo) setMessages(convo.messages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Load convo error:", err);
      }
    };
    loadConvo();
  }, [activeConvoId]);

  // Save convo whenever messages update
  useEffect(() => {
    const saveConvo = async () => {
      try {
        if (messages.length === 0) return;
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        let convos: Conversation[] = stored ? JSON.parse(stored) : [];

        if (activeConvoId) {
          // update existing convo
          convos = convos.map((c) =>
            c.id === activeConvoId ? { ...c, messages } : c
          );
        } else {
          // create new convo
          const newId = Date.now().toString();
          const newConvo: Conversation = {
            id: newId,
            messages,
            createdAt: new Date().toISOString(),
          };
          convos.unshift(newConvo);
          setActiveConvoId(newId);
          navigation.setParams({ convoId: newId });
        }

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
      } catch (err) {
        console.error("Save convo error:", err);
      }
    };
    saveConvo();
  }, [messages]);

  // --- Send Message (JSON mode, not SSE) ---
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/vira/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          convoId: activeConvoId || Date.now().toString(),
          message: userMessage.text,
        }),
      });

      if (!response.ok) {
        throw new Error("Bad response from server");
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: Date.now().toString() + "_vira",
        sender: "vira",
        text: data.reply || "⚠️ No reply received.",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_error",
          sender: "vira",
          text: "⚠️ Network error. Please check your connection.",
        },
      ]);
    } finally {
      setLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  // --- Render each message ---
  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.message,
        item.sender === "user" ? styles.userMessage : styles.viraMessage,
      ]}
    >
      {item.sender === "vira" ? (
        <Markdown style={styles.markdown}>{item.text}</Markdown>
      ) : (
        <Text style={[styles.messageText, styles.userText]}>{item.text}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="sparkles" size={20} color="#2563eb" />
          <Text style={styles.headerTitle}>Chat with Vira</Text>
          <Pressable
            style={{ marginLeft: "auto" }}
            onPress={() => navigation.navigate("ViraConversations")}
          >
            <Ionicons name="menu" size={22} color="#2563eb" />
          </Pressable>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything about travel..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
          />
          <Pressable
            style={[styles.sendButton, loading && { opacity: 0.6 }]}
            onPress={sendMessage}
            disabled={loading}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#111827",
  },
  messages: { padding: 16, flexGrow: 1 },
  message: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: "80%",
  },
  userMessage: { backgroundColor: "#2563eb", alignSelf: "flex-end" },
  viraMessage: { backgroundColor: "#f3f4f6", alignSelf: "flex-start" },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: "#fff" },
  viraText: { color: "#111827" },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  // ✅ Markdown style overrides
  markdown: {
    body: { color: "#111827", fontSize: 15, lineHeight: 20 },
    bullet_list: { marginVertical: 4 },
    list_item: { flexDirection: "row", marginBottom: 2 },
    strong: { fontWeight: "700", color: "#111827" },
  },
});
