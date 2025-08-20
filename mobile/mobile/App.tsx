import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import TripsScreen from './src/screens/TripsScreen';
import AddTripScreen from './src/screens/AddTripScreen';
import AirportScreen from './src/screens/AirportScreen';
import TransportOptionsScreen from './src/screens/TransportOptionsScreen';
import PrefsScreen from './src/screens/PrefsScreen';
import CarTripScreen from './src/screens/CarTripScreen';
import TripPlanScreen from './src/screens/TripPlanScreen';


// Route types
export type RootStackParamList = {
  Login: undefined;
  Trips: undefined;
  AddTrip: undefined;
  Airport: undefined;
  CarTrip: { city: string };
  TransportOptions: { airport: string; destination: string };
  PrefsScreen: { airport: string; destination: string; mode: string };
  TripPlan: {
    airport: string;
    destination: string;
    mode: string;
    duration: string;
    budget: string;
    mood: string;
    food: string;
    activities: string;
    commitments: string;
  };
};
  // Reached: undefined; // uncomment + add screen later if you build it


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Vayro Login' }}
        />
        <Stack.Screen
          name="Trips"
          component={TripsScreen}
          options={{ title: 'Your Trips' }}
        />
        <Stack.Screen
          name="AddTrip"
          component={AddTripScreen}
          options={{ title: 'Add Trip' }}
        />
        <Stack.Screen
          name="Airport"
          component={AirportScreen}
          options={{ title: 'Arrival' }}
        />
        <Stack.Screen
          name="TransportOptions"
          component={TransportOptionsScreen}
          options={{ title: 'Transport Options' }}
        />
        <Stack.Screen 
          name="PrefsScreen" 
          component={PrefsScreen} 
          options={{ title: 'Plan your trip' }} 
        />
        <Stack.Screen 
          name="CarTrip" 
          component={CarTripScreen} 
          options={{ title: 'Car Trip Details' }} 
        />
        <Stack.Screen 
          name="TripPlan" 
          component={TripPlanScreen} 
          options={{ title: 'Your Trip Plan' }} 
        />
        {/*
        <Stack.Screen
          name="Reached"
          component={ReachedScreen}
          options={{ title: 'Reached Destination' }}
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

