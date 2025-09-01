// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Screens
import AuthScreen from "./src/screens/AuthScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TripsScreen from "./src/screens/TripsScreen";
import AddTripScreen from "./src/screens/AddTripScreen";
import AirportScreen from "./src/screens/AirportScreen";
import TransportOptionsScreen from "./src/screens/TransportOptionsScreen";
import PrefsScreen from "./src/screens/PrefsScreen";
import CarTripScreen from "./src/screens/CarTripScreen";
import TripPlanScreen from "./src/screens/TripPlanScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SavedTripDetailsScreen from "./src/screens/SavedTripDetailsScreen";

// ✅ Profile flow new screens
import EditProfileScreen from "./src/screens/EditProfileScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import HelpSupportScreen from "./src/screens/HelpSupportScreen";
import AboutAppScreen from "./src/screens/AboutAppScreen";

// ✅ Flights flow
import FlightsScreen from "./src/screens/FlightsScreen";
import FlightFormScreen from "./src/screens/FlightFormScreen";
import FlightResultsScreen from "./src/screens/FlightResultsScreen";
import FlightDetailsScreen from "./src/screens/FlightDetailsScreen";

// ✅ Vira chat screens
import ViraChatScreen from "./src/screens/ViraChatScreen";
import ViraConversationsScreen from "./src/screens/ViraConversationsScreen"; // 🔥 new screen

// ✅ Stack Route types
export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: { screen?: keyof TabParamList };
  AddTrip: undefined;

  Airport: {
    departCountry: string;
    departCity: string;
    destCountry: string;
    destCity: string;
    mode: "air" | "car";
  };

  CarTrip: { city: string };

  TransportOptions: {
    departCountry: string;
    departCity: string;
    destCountry: string;
    destCity: string;
    airport: string;
    airportCity?: string;
    airportCountry?: string;
    destination: string;
    undecided?: boolean;
    arrivalTime: string;
    mode?: string;
  };

  PrefsScreen: {
    departCountry: string;
    departCity: string;
    destCountry: string;
    destCity: string;
    mode: string;
  };

  TripPlan: {
    departCountry: string;
    departCity: string;
    destCountry: string;
    destCity: string;
    mode: string;
    duration: string;
    budget: string;
    mood: string;
    food: string;
    activities: string;
    travelSolo: string;
    commitments: string[];
    visitedBefore: string[];
    tripDates: string[];
  };

  SavedTripDetails: {
    id: number;
    destCity: string;
    destCountry: string;
    duration: string;
    tripDates: string[];
    plan: any;
    budgetSummary: any;
  };

  // ✅ Flights flow
  FlightForm: undefined;
  FlightResults: {
    departure: string;
    destination: string;
    departureDate: string;
    returnDate?: string | null;
    passengers: number;
    budget?: number;
    allowLayover: boolean;
  };
  FlightDetails: {
    id: number;
    departure: string;
    destination: string;
    departureDate: string;
    returnDate?: string | null;
    summary: string;
  };

  // ✅ Profile flow
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
  HelpSupport: undefined;
  AboutApp: undefined;

  // ✅ Vira chat
  ViraChat: { convoId?: string }; // pass convoId when opening existing convo
  ViraConversations: undefined;
};

// ✅ Tab types
export type TabParamList = {
  Home: undefined;
  Flights: undefined;
  Trips: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// ✅ Bottom Tabs Layout
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Flights") iconName = "airplane";
          else if (route.name === "Trips") iconName = "map-outline";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Flights" component={FlightsScreen} />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ✅ Root App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: "#2563eb",
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="arrow-back" size={22} color="#2563eb" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
              style={{ paddingHorizontal: 8 }}
            >
              <Ionicons name="home" size={22} color="#2563eb" />
            </Pressable>
          ),
        })}
      >
        {/* Auth flow */}
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />

        {/* Tabs */}
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />

        {/* Other screens */}
        <Stack.Screen name="AddTrip" component={AddTripScreen} />
        <Stack.Screen name="Airport" component={AirportScreen} />
        <Stack.Screen name="TransportOptions" component={TransportOptionsScreen} />
        <Stack.Screen name="PrefsScreen" component={PrefsScreen} />
        <Stack.Screen name="CarTrip" component={CarTripScreen} />
        <Stack.Screen name="TripPlan" component={TripPlanScreen} />
        <Stack.Screen name="SavedTripDetails" component={SavedTripDetailsScreen} />

        {/* Flights */}
        <Stack.Screen name="FlightForm" component={FlightFormScreen} />
        <Stack.Screen name="FlightResults" component={FlightResultsScreen} />
        <Stack.Screen name="FlightDetails" component={FlightDetailsScreen} />

        {/* Profile */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="AboutApp" component={AboutAppScreen} />

        {/* Vira Chat */}
        <Stack.Screen
          name="ViraConversations"
          component={ViraConversationsScreen}
          options={{ title: "Vira Chats" }}
        />
        <Stack.Screen
          name="ViraChat"
          component={ViraChatScreen}
          options={{ title: "Chat with Vira" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




