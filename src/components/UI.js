import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, TextInput, ActivityIndicator, Animated } from 'react-native';
import { colors, spacing, fontSize, radius } from '../utils/theme';

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }) {
  const bg = variant === 'primary' ? colors.accent : variant === 'danger' ? colors.danger : variant === 'outline' ? 'transparent' : colors.cardLight;
  const tc = variant === 'outline' ? colors.accent : variant === 'secondary' ? colors.text : '#000';
  return (
    <TouchableOpacity onPress={onPress} disabled={loading || disabled}
      style={[st.btn, { backgroundColor: bg, opacity: disabled ? 0.5 : 1, borderColor: variant === 'outline' ? colors.accent : 'transparent', borderWidth: variant === 'outline' ? 1.5 : 0 }, style]}>
      {loading ? <ActivityIndicator color={tc} size="small" /> : <Text style={[st.btnText, { color: tc }]}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function InputField({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, multiline, editable = true }) {
  return (
    <View style={st.inputWrap}>
      {label ? <Text style={st.inputLabel}>{label}</Text> : null}
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor={colors.textMuted} secureTextEntry={secureTextEntry}
        keyboardType={keyboardType} multiline={multiline} editable={editable}
        style={[st.input, multiline && { height: 100, textAlignVertical: 'top' }, !editable && { opacity: 0.6 }]} />
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[st.card, style]}>{children}</View>;
}

export function Tag({ label, color = colors.accent, bg }) {
  return (
    <View style={[st.tag, { backgroundColor: bg || color + '22' }]}>
      <Text style={[st.tagText, { color }]}>{label}</Text>
    </View>
  );
}

export function CountdownTimer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const iv = setInterval(() => {
      setRemaining(p => {
        if (p <= 1) { clearInterval(iv); onExpire && onExpire(); return 0; }
        return p - 1;
      });
    }, 1000);
    Animated.timing(progress, { toValue: 0, duration: seconds * 1000, useNativeDriver: false }).start();
    return () => clearInterval(iv);
  }, []);
  const bc = remaining > 20 ? colors.success : remaining > 10 ? colors.accent : colors.danger;
  return (
    <View style={st.timerWrap}>
      <Text style={[st.timerText, { color: bc }]}>{remaining}s</Text>
      <View style={st.timerBar}>
        <Animated.View style={[st.timerFill, { backgroundColor: bc, width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
      </View>
    </View>
  );
}

export function EmptyState({ icon, title, subtitle }) {
  return (
    <View style={st.empty}>
      <Text style={st.emptyIcon}>{icon}</Text>
      <Text style={st.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={st.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={st.sectionRow}>
      <Text style={st.sectionTitle}>{title}</Text>
      {action ? <TouchableOpacity onPress={onAction}><Text style={st.sectionAction}>{action}</Text></TouchableOpacity> : null}
    </View>
  );
}

const st = StyleSheet.create({
  btn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: fontSize.md, fontWeight: '700' },
  inputWrap: { marginBottom: spacing.lg },
  inputLabel: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs, fontWeight: '600' },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: 14, color: colors.text, fontSize: fontSize.md },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  tag: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, alignSelf: 'flex-start' },
  tagText: { fontSize: fontSize.xs, fontWeight: '700' },
  timerWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timerText: { fontSize: fontSize.md, fontWeight: '800', width: 36 },
  timerBar: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 3 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  emptySubtitle: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs, textAlign: 'center' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, marginTop: spacing.xl },
  sectionTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  sectionAction: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '600' },
});
