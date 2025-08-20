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
import WishlistScreen from "./src/screens/WishlistScreen";

// ✅ Consistent Stack Route types
export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  AddTrip: undefined;

  Airport: { departCountry: string; departCity: string; destCountry: string; destCity: string; mode: "air" | "car" };
  CarTrip: { city: string };

  TransportOptions: {
    departCountry: string;
    departCity: string;
    destCountry: string;
    destCity: string;
    airport: string;
    destination:string;
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
};

// Tab types
export type TabParamList = {
  Home: undefined;
  Trips: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Bottom Tabs Layout
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
          else if (route.name === "Trips") iconName = "airplane";
          else if (route.name === "Wishlist") iconName = "heart";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Root App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Entry point → Auth Screen */}
        <Stack.Screen name="Auth" component={AuthScreen} />

        {/* Auth flow */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* After login/signup → Tabs */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Nested flows accessible from Trips */}
        <Stack.Screen name="AddTrip" component={AddTripScreen} />
        <Stack.Screen name="Airport" component={AirportScreen} />
        <Stack.Screen name="TransportOptions" component={TransportOptionsScreen} />
        <Stack.Screen name="PrefsScreen" component={PrefsScreen} />
        <Stack.Screen name="CarTrip" component={CarTripScreen} />
        <Stack.Screen name="TripPlan" component={TripPlanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




