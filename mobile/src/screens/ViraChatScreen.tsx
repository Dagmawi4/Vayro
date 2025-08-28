// src/screens/ViraChatScreen.tsx
import React, { useState } from "react";
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
import { API_BASE } from "../api/config";

type Message = {
  id: string;
  sender: "user" | "vira";
  text: string;
};

export default function ViraChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: Date.now().toString() + "_vira",
        sender: "vira",
        text: data.reply || "Sorry, I didn’t catch that.",
      };

      setMessages((prev) => [...prev, aiMessage]);
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
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.message,
        item.sender === "user" ? styles.userMessage : styles.viraMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === "user" ? styles.userText : styles.viraText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="sparkles" size={20} color="#2563eb" />
          <Text style={styles.headerTitle}>Chat with Vira</Text>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messages}
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
    paddingVertical: 10,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
