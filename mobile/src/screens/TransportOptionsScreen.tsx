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
type Mode = "uberlyft" | "shuttle" | "rental" | "friend";

export default function TransportOptionsScreen({ route, navigation }: Props) {
  const {
    departCity = "",
    destCity = "",
    mode: initialMode = "uberlyft",
  } = route.params || {};

  const [mode, setMode] = useState<Mode>(initialMode as Mode);
  const [loading, setLoading] = useState(true);
  const [est, setEst] = useState<{ uber: number; lyft: number } | null>(null);

  useEffect(() => {
    if (mode !== "uberlyft") {
      setLoading(false);
      return;
    }
    setLoading(true);

    // Mock estimates
    setTimeout(() => {
      setEst({
        uber: 22.5 + Math.random() * 10,
        lyft: 20.3 + Math.random() * 8,
      });
      setLoading(false);
    }, 1000);
  }, [mode]);

  function handleArrived() {
    navigation.navigate("PrefsScreen", {
      departCity,
      destCity,
      mode,
    });
  }

  function renderDetails() {
    if (mode === "uberlyft") {
      if (loading) return <ActivityIndicator size="large" color="#2563eb" />;
      if (!est) return null;
      return (
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>Uber / Lyft</Text>
          <Text style={styles.desc}>
            Estimated UberX: ${est.uber.toFixed(2)} | Lyft: $
            {est.lyft.toFixed(2)}
          </Text>
          <Text style={styles.desc}>
            Pickup Location: Level 2, near Door 5. Follow “Rideshare” signs. 🚖
          </Text>
          <Text style={styles.desc}>
            Average Wait: 5–8 minutes. Drivers update location in real time.
          </Text>
          <Text style={styles.desc}>
            Note: During peak hours (evenings & weekends), surge pricing may
            apply.
          </Text>
        </View>
      );
    }
    if (mode === "shuttle") {
      return (
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>Airport Shuttle</Text>
          <Text style={styles.desc}>Flat Rate: ~$12 per person</Text>
          <Text style={styles.desc}>
            Pickup Location: Ground Transportation Center, Level 1, outside Door
            3. 🚌
          </Text>
          <Text style={styles.desc}>
            Schedule: Runs every 30 minutes between 5:00 AM – 11:30 PM.
          </Text>
          <Text style={styles.desc}>
            Average Travel Time: 40 minutes to downtown depending on traffic.
          </Text>
          <Text style={styles.desc}>
            Tickets: Can be purchased at the kiosk next to the pickup area.
          </Text>
        </View>
      );
    }
    if (mode === "rental") {
      return (
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>Car Rental</Text>
          <Text style={styles.desc}>Daily Rates: ~$45/day (Economy)</Text>
          <Text style={styles.desc}>
            Rental Car Center: Connected via SkyTrain from Terminal B. 🚗
          </Text>
          <Text style={styles.desc}>
            Companies Available: Enterprise, Hertz, Avis, Budget, National.
          </Text>
          <Text style={styles.desc}>
            Requirements: Driver’s license + credit card deposit required.
          </Text>
          <Text style={styles.desc}>
            Note: Some companies offer direct pickup shuttles from Arrivals.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>Family / Friend Pickup</Text>
        <Text style={styles.desc}>
          Pickup Location: Passenger Pickup Area, Level 1 Arrivals. 🚙
        </Text>
        <Text style={styles.desc}>
          Wait Zones: Drivers can wait up to 15 minutes for free in the
          short-term parking lot.
        </Text>
        <Text style={styles.desc}>
          Meet Point: Near baggage claim exit, Door 6. Look for “Passenger
          Pickup” signs.
        </Text>
        <Text style={styles.desc}>
          Pro Tip: Call or text your ride as soon as you collect baggage to
          avoid delays.
        </Text>
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
      icon: (
        <MaterialCommunityIcons name="account-group" size={30} color="#2563eb" />
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Transport Options</Text>
      <Text style={styles.sub}>
        {departCity || "Origin"} → {destCity || "Destination"}
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
  sub: { color: "#6b7280", marginTop: 4, marginBottom: 20, textAlign: "center" },
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






