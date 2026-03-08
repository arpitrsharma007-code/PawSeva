import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import ShopDashboardScreen from '../screens/shop/ShopDashboardScreen';
import ShopHistoryScreen from '../screens/shop/ShopHistoryScreen';
import ShopAnalyticsScreen from '../screens/shop/ShopAnalyticsScreen';
import ShopProfileScreen from '../screens/shop/ShopProfileScreen';

const Tab = createBottomTabNavigator();

export default function ShopNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border, height: 60, paddingBottom: 8 },
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarIcon: ({ color, size }) => {
        const icons = { Dashboard: 'grid', History: 'time', Analytics: 'bar-chart', Profile: 'person' };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Dashboard" component={ShopDashboardScreen} />
      <Tab.Screen name="History" component={ShopHistoryScreen} />
      <Tab.Screen name="Analytics" component={ShopAnalyticsScreen} />
      <Tab.Screen name="Profile" component={ShopProfileScreen} />
    </Tab.Navigator>
  );
}
