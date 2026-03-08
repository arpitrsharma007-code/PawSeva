import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../utils/theme';
import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import ShopNavigator from './ShopNavigator';

export default function RootNavigator() {
  const { user, userData, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }
  if (!user || !userData) return <AuthNavigator />;
  if (userData.role === 'shop') return <ShopNavigator />;
  return <OwnerNavigator />;
}
