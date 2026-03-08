import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import { Button, InputField } from '../../components/UI';
import { registerUser } from '../../services/authService';

export default function RegisterScreen({ navigation, route }) {
  const role = route.params?.role || 'owner';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) { Alert.alert('Error', 'Please fill all required fields'); return; }
    if (role === 'shop' && !businessName) { Alert.alert('Error', 'Please enter your business name'); return; }
    setLoading(true);
    try {
      await registerUser({ email, password, name, role, businessName, phone });
    } catch (e) {
      Alert.alert('Registration Failed', e.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={st.scroll} keyboardShouldPersistTaps="handled">
        <Text style={st.title}>PawSeva mein swagat hai</Text>
        <Text style={st.subtitle}>Register as {role === 'owner' ? 'Pet Owner' : 'Pet Shop / Vet'}</Text>
        <InputField label="Full Name *" value={name} onChangeText={setName} placeholder="Your name" />
        <InputField label="Email *" value={email} onChangeText={setEmail} placeholder="email@example.com" keyboardType="email-address" />
        <InputField label="Password *" value={password} onChangeText={setPassword} placeholder="Min 6 characters" secureTextEntry />
        <InputField label="Phone" value={phone} onChangeText={setPhone} placeholder="+91 XXXXXXXXXX" keyboardType="phone-pad" />
        {role === 'shop' && <InputField label="Business Name *" value={businessName} onChangeText={setBusinessName} placeholder="Your shop name" />}
        <Button title="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: spacing.lg }} />
        <Text style={st.link} onPress={() => navigation.navigate('Login')}>Already have an account? Log in</Text>
        <Text style={st.switchRole} onPress={() => navigation.navigate('Register', { role: role === 'owner' ? 'shop' : 'owner' })}>
          Register as {role === 'owner' ? 'Pet Shop' : 'Pet Owner'} instead
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xxl, paddingTop: spacing.xxxl },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.xxxl },
  link: { color: colors.accent, fontSize: fontSize.md, fontWeight: '600', textAlign: 'center', marginTop: spacing.xl },
  switchRole: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.md },
});
