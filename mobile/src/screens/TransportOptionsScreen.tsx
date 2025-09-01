import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "TransportOptions">;
type Mode = "uberlyft" | "shuttle" | "rental" | "friend" | null;

type TransportResponse = {
  title: string;
  details: string[];
  meta?: Record<string, any>;
};

export default function TransportOptionsScreen({ route, navigation }: Props) {
  const {
    departCity = "",
    destCity = "",
    airport = "",
    airportCity = "",
    airportCountry = "",
    destination = "",
    undecided = false,
  } = route.params || {};

  const [mode, setMode] = useState<Mode>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TransportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔎 Fetch transport option when mode changes
  useEffect(() => {
    if (!mode) return;

    async function fetchOption() {
      try {
        setLoading(true);
        setError(null);
        setData(null);

        const res = await fetch("http://10.0.0.128:4000/api/transport/options", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            airport,
            airportCity,
            airportCountry,
            destination,
            undecided,
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch");

        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOption();
  }, [mode]);

  function handleArrived() {
    navigation.navigate("PrefsScreen", {
      departCity,
      destCity,
      mode: mode || "skipped", // pass skipped if no selection
    });
  }

  function renderDetails() {
    if (!mode) return null;

    if (loading) return <ActivityIndicator size="large" color="#2563eb" />;
    if (error) return <Text style={{ color: "red" }}>{error}</Text>;
    if (!data) return null;

    return (
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{data.title}</Text>
        {data.details.map((line, idx) => (
          <Text key={idx} style={styles.desc}>
            {line}
          </Text>
        ))}
      </View>
    );
  }

  const options = [
    {
      key: "uberlyft",
      label: "Uber / Lyft",
      icon: <AntDesign name="car" size={28} color="#2563eb" />,
    },
    {
      key: "shuttle",
      label: "Shuttle",
      icon: <MaterialCommunityIcons name="bus" size={30} color="#2563eb" />,
    },
    {
      key: "rental",
      label: "Car Rental",
      icon: <MaterialCommunityIcons name="car-key" size={30} color="#2563eb" />,
    },
    {
      key: "friend",
      label: "Friend / Family",
      icon: <MaterialCommunityIcons name="account-group" size={30} color="#2563eb" />,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Transport Options</Text>
      <Text style={styles.sub}>
        {departCity || "Origin"} → {destCity || "Destination"}
      </Text>
      <Text style={styles.info}>
        Tap "Arrived at Destination" to skip, or choose an option to view details.
      </Text>

      <View style={styles.optionsGrid}>
        {options.map((opt) => (
          <Pressable
            key={opt.key}
            style={[
              styles.optionCard,
              mode === opt.key && styles.optionCardActive,
            ]}
            onPress={() => setMode(opt.key as Mode)}
          >
            <View style={styles.optionRow}>
              <Text
                style={[
                  styles.optionText,
                  mode === opt.key && styles.optionTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {opt.icon}
            </View>
          </Pressable>
        ))}
      </View>

      <ScrollView style={{ marginTop: 20, flex: 1 }}>{renderDetails()}</ScrollView>

      <Pressable style={styles.button} onPress={handleArrived}>
        <AntDesign name="checkcircleo" size={20} color="#fff" />
        <Text style={styles.buttonText}>Arrived at Destination</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginTop: 10 },
  sub: { color: "#6b7280", marginTop: 4, marginBottom: 10, textAlign: "center" },
  info: { color: "#374151", fontSize: 14, textAlign: "center", marginBottom: 20 },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionCard: {
    width: "47%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  optionCardActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: { fontWeight: "600", fontSize: 16, color: "#111827" },
  optionTextActive: { color: "#fff" },
  cardDetails: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#f9fafb",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  desc: { fontSize: 15, marginBottom: 4, color: "#374151", lineHeight: 20 },
  button: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 16,
  },
});
