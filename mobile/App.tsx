// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
import FlightsScreen from "./src/screens/FlightsScreen";
import FlightFormScreen from "./src/screens/FlightFormScreen";
import FlightResultsScreen from "./src/screens/FlightResultsScreen";
import FlightDetailsScreen from "./src/screens/FlightDetailsScreen"; // ✅ NEW

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
    destination: string;
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="AddTrip" component={AddTripScreen} />
        <Stack.Screen name="Airport" component={AirportScreen} />
        <Stack.Screen
          name="TransportOptions"
          component={TransportOptionsScreen}
        />
        <Stack.Screen name="PrefsScreen" component={PrefsScreen} />
        <Stack.Screen name="CarTrip" component={CarTripScreen} />
        <Stack.Screen name="TripPlan" component={TripPlanScreen} />

        {/* ✅ Flights flow */}
        <Stack.Screen name="FlightForm" component={FlightFormScreen} />
        <Stack.Screen name="FlightResults" component={FlightResultsScreen} />
        <Stack.Screen name="FlightDetails" component={FlightDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

