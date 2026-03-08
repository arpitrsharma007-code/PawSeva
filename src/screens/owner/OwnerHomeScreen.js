import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import { Card, Tag, SectionHeader, EmptyState } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToOwnerRequests } from '../../services/requestService';
import { ALL_SERVICES } from '../../utils/services';

const STATUS_COLORS = {
  pending: colors.accent, accepted: colors.info, 'in-progress': colors.success,
  completed: colors.textMuted, cancelled: colors.danger,
};

export default function OwnerHomeScreen({ navigation }) {
  const { user, userData } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToOwnerRequests(user.uid, setRequests);
    return unsub;
  }, [user]);

  const activeRequests = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
  const topServices = ALL_SERVICES.slice(0, 8);

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={st.scroll}>
        <Text style={st.greeting}>Hi {userData?.name || 'there'}</Text>
        <Text style={st.sub}>What does your pet need today?</Text>

        <View style={st.grid}>
          {topServices.map(s => (
            <TouchableOpacity key={s.key} style={st.serviceCard}
              onPress={() => navigation.navigate('NewRequest', { service: s.name })}>
              <View style={[st.serviceIcon, { backgroundColor: s.color + '22' }]}>
                <Ionicons name={s.icon} size={24} color={s.color} />
              </View>
              <Text style={st.serviceName}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={st.browseAll} onPress={() => navigation.navigate('NewRequest', { service: '' })}>
          <Ionicons name="apps" size={18} color={colors.accent} />
          <Text style={st.browseText}>Browse all services</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.accent} />
        </TouchableOpacity>

        {activeRequests.length > 0 && (
          <>
            <SectionHeader title="Active Requests" />
            {activeRequests.map(req => (
              <TouchableOpacity key={req.id} onPress={() => navigation.navigate('RequestDetail', { requestId: req.id })}>
                <Card>
                  <View style={st.reqRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={st.reqService}>{req.service}</Text>
                      <Text style={st.reqPet}>{req.petName} ({req.petType})</Text>
                      <Text style={st.reqDate}>{req.preferredDate} at {req.preferredTime}</Text>
                    </View>
                    <Tag label={req.status} color={STATUS_COLORS[req.status] || colors.accent} />
                  </View>
                  {req.acceptedShopName && <Text style={st.shopName}>Shop: {req.acceptedShopName}</Text>}
                </Card>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: 100 },
  greeting: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  sub: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceCard: { width: '23%', alignItems: 'center', marginBottom: spacing.lg },
  serviceIcon: { width: 52, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  serviceName: { color: colors.textSecondary, fontSize: fontSize.xs, fontWeight: '600', textAlign: 'center' },
  browseAll: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  browseText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700' },
  reqRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  reqService: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  reqPet: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 },
  reqDate: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 4 },
  shopName: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '600', marginTop: spacing.sm },
});
