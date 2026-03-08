import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize } from '../../utils/theme';
import { Button } from '../../components/UI';

export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={st.top}>
        <Text style={st.logo}>PawSeva</Text>
        <Text style={st.tagline}>Apke Pet Ki Seva, Har Baar</Text>
      </View>
      <View style={st.mid}>
        <Text style={st.midText}>I am a...</Text>
        <Button title="Pet Owner" onPress={() => navigation.navigate('Register', { role: 'owner' })} style={st.btn} />
        <Button title="Pet Shop / Vet" onPress={() => navigation.navigate('Register', { role: 'shop' })} variant="outline" style={st.btn} />
      </View>
      <View style={st.bottom}>
        <Text style={st.link} onPress={() => navigation.navigate('Login')}>
          Already have an account? Log in
        </Text>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.xxl },
  top: { flex: 2, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: fontSize.hero, fontWeight: '900', color: colors.accent, letterSpacing: 2 },
  tagline: { color: colors.textSecondary, fontSize: fontSize.md, marginTop: spacing.sm },
  mid: { flex: 2, justifyContent: 'center' },
  midText: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.xl, textAlign: 'center' },
  btn: { marginBottom: spacing.md },
  bottom: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: spacing.xl },
  link: { color: colors.accent, fontSize: fontSize.md, fontWeight: '600' },
});
