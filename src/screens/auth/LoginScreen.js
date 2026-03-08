import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize } from '../../utils/theme';
import { Button, InputField } from '../../components/UI';
import { loginUser, resetPassword } from '../../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleForgotPassword = () => {
    if (!email) { Alert.alert('Enter Email', 'Please enter your email address first, then tap Forgot Password.'); return; }
    Alert.alert('Reset Password', `Send password reset link to ${email}?`, [
      { text: 'Cancel' },
      { text: 'Send', onPress: async () => {
        try {
          await resetPassword(email);
          Alert.alert('Email Sent', 'Check your inbox for the password reset link.');
        } catch (e) {
          Alert.alert('Error', e.message);
        }
      }}
    ]);
  };

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill all fields'); return; }
    setLoading(true);
    try {
      await loginUser({ email, password });
    } catch (e) {
      Alert.alert('Login Failed', e.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={st.scroll} keyboardShouldPersistTaps="handled">
        <Text style={st.title}>Welcome back</Text>
        <Text style={st.subtitle}>Sign in to PawSeva</Text>
        <InputField label="Email" value={email} onChangeText={setEmail} placeholder="email@example.com" keyboardType="email-address" />
        <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry />
        <Text style={st.forgot} onPress={handleForgotPassword}>Forgot Password?</Text>
        <Button title="Log In" onPress={handleLogin} loading={loading} style={{ marginTop: spacing.lg }} />
        <Text style={st.link} onPress={() => navigation.navigate('Splash')}>
          Back to registration
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xxl, paddingTop: 80 },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.xxxl },
  link: { color: colors.accent, fontSize: fontSize.md, fontWeight: '600', textAlign: 'center', marginTop: spacing.xl },
  forgot: { color: colors.gold || '#E6B422', fontSize: fontSize.sm, textAlign: 'right', marginTop: spacing.sm },
});
