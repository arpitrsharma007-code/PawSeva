import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import { Card, Tag, Button } from '../../components/UI';
import { getRequest, updateRequestStatus } from '../../services/requestService';
import { TouchableOpacity } from 'react-native';

const STEPS = ['Posted', 'Accepted', 'In Progress', 'Done'];

export default function RequestDetailScreen({ navigation, route }) {
  const { requestId } = route.params;
  const [req, setReq] = useState(null);

  useEffect(() => {
    loadRequest();
  }, []);

  const loadRequest = async () => {
    const data = await getRequest(requestId);
    setReq(data);
  };

  const getStepIndex = (status) => {
    const map = { pending: 0, accepted: 1, 'in-progress': 2, completed: 3 };
    return map[status] || 0;
  };

  const handleCancel = () => {
    Alert.alert('Cancel Request', 'Are you sure?', [
      { text: 'No' },
      { text: 'Yes', style: 'destructive', onPress: async () => {
        await updateRequestStatus(requestId, 'cancelled');
        navigation.goBack();
      }},
    ]);
  };

  if (!req) return (
    <SafeAreaView style={st.container}>
      <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 100 }}>Loading...</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={st.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.back}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={st.title}>{req.service}</Text>
        <Tag label={req.status} color={req.status === 'completed' ? colors.success : colors.accent} />

        <View style={st.tracker}>
          {STEPS.map((step, i) => (
            <View key={i} style={st.stepRow}>
              <View style={[st.dot, { backgroundColor: i <= getStepIndex(req.status) ? colors.accent : colors.border }]} />
              <Text style={[st.stepText, i <= getStepIndex(req.status) && { color: colors.text }]}>{step}</Text>
              {i < STEPS.length - 1 && <View style={[st.line, { backgroundColor: i < getStepIndex(req.status) ? colors.accent : colors.border }]} />}
            </View>
          ))}
        </View>

        <Card>
          <Text style={st.cardLabel}>Pet</Text>
          <Text style={st.cardValue}>{req.petName} ({req.petType})</Text>
          <Text style={[st.cardLabel, { marginTop: spacing.md }]}>Date & Time</Text>
          <Text style={st.cardValue}>{req.preferredDate} at {req.preferredTime}</Text>
          {req.notes ? <><Text style={[st.cardLabel, { marginTop: spacing.md }]}>Notes</Text><Text style={st.cardValue}>{req.notes}</Text></> : null}
          {req.location?.address ? <><Text style={[st.cardLabel, { marginTop: spacing.md }]}>Location</Text><Text style={st.cardValue}>{req.location.address}</Text></> : null}
        </Card>

        {req.acceptedShopName && (
          <Card>
            <Text style={st.cardLabel}>Accepted by</Text>
            <Text style={[st.cardValue, { color: colors.accent, fontWeight: '700' }]}>{req.acceptedShopName}</Text>
          </Card>
        )}

        {req.status === 'pending' && (
          <Button title="Cancel Request" variant="danger" onPress={handleCancel} style={{ marginTop: spacing.lg }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xxl, paddingBottom: 100 },
  back: { marginBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  tracker: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  stepRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  stepText: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600', marginLeft: 4 },
  line: { flex: 1, height: 2, marginHorizontal: 4 },
  cardLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' },
  cardValue: { color: colors.text, fontSize: fontSize.md, marginTop: 2 },
});
