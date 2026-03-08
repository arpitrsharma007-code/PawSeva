import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import OwnerHomeScreen from '../screens/owner/OwnerHomeScreen';
import NewRequestScreen from '../screens/owner/NewRequestScreen';
import RequestDetailScreen from '../screens/owner/RequestDetailScreen';
import OwnerBookingsScreen from '../screens/owner/OwnerBookingsScreen';
import OwnerProfileScreen from '../screens/owner/OwnerProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OwnerHome" component={OwnerHomeScreen} />
      <Stack.Screen name="NewRequest" component={NewRequestScreen} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
    </Stack.Navigator>
  );
}

export default function OwnerNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border, height: 60, paddingBottom: 8 },
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarIcon: ({ color, size }) => {
        const icons = { Home: 'home', Bookings: 'calendar', Profile: 'person' };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Bookings" component={OwnerBookingsScreen} />
      <Tab.Screen name="Profile" component={OwnerProfileScreen} />
    </Tab.Navigator>
  );
}
