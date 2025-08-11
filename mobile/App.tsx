import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import TripsScreen from './src/screens/TripsScreen';

export type RootStackParamList = {
  Login: undefined;
  Trips: undefined;
};

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
