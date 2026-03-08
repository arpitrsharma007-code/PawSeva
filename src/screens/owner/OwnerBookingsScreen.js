import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import { Card, Tag, EmptyState } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToOwnerRequests } from '../../services/requestService';

const FILTERS = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];
const STATUS_COLORS = { pending: colors.accent, accepted: colors.info, 'in-progress': colors.success, completed: colors.textMuted, cancelled: colors.danger };

export default function OwnerBookingsScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToOwnerRequests(user.uid, setRequests);
    return unsub;
  }, [user]);

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter.toLowerCase());

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />
      <Text style={st.title}>My Bookings</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.filterRow} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} style={[st.filterChip, filter === f && st.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[st.filterText, filter === f && st.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={st.scroll}>
        {filtered.length === 0 ? (
          <EmptyState icon="📋" title="No bookings" subtitle={filter === 'All' ? 'Create a request to get started' : 'No ' + filter.toLowerCase() + ' bookings'} />
        ) : filtered.map(req => (
          <Card key={req.id}>
            <View style={st.row}>
              <View style={{ flex: 1 }}>
                <Text style={st.service}>{req.service}</Text>
                <Text style={st.pet}>{req.petName} - {req.preferredDate}</Text>
              </View>
              <Tag label={req.status} color={STATUS_COLORS[req.status] || colors.accent} />
            </View>
            {req.acceptedShopName && <Text style={st.shop}>Shop: {req.acceptedShopName}</Text>}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, padding: spacing.lg, paddingBottom: spacing.sm },
  filterRow: { maxHeight: 50, marginBottom: spacing.sm },
  filterChip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm, backgroundColor: colors.card },
  filterActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600' },
  filterTextActive: { color: '#000' },
  scroll: { padding: spacing.lg, paddingBottom: 100 },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  service: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  pet: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 },
  shop: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '600', marginTop: spacing.sm },
});
