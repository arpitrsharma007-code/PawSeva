import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import { Card, EmptyState } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToShopJobs } from '../../services/requestService';

export default function ShopAnalyticsScreen() {
  const { user, userData } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToShopJobs(user.uid, setJobs);
    return unsub;
  }, [user]);

  const completed = jobs.filter(j => j.status === 'completed');
  const inProgress = jobs.filter(j => j.status === 'in-progress');

  // Calculate earnings from service prices
  const serviceDetails = userData?.serviceDetails || [];
  const getServicePrice = (serviceName) => {
    const svc = serviceDetails.find(s => s.name === serviceName && s.enabled);
    if (!svc) return 0;
    if (svc.priceType === 'fixed') return parseFloat(svc.fixedPrice) || 0;
    if (svc.priceType === 'range') {
      const min = parseFloat(svc.minPrice) || 0;
      const max = parseFloat(svc.maxPrice) || 0;
      return max > 0 ? (min + max) / 2 : min;
    }
    return 0;
  };

  const totalEarnings = completed.reduce((sum, job) => sum + getServicePrice(job.service), 0);
  const avgPerJob = completed.length > 0 ? Math.round(totalEarnings / completed.length) : 0;

  // Service breakdown
  const services = {};
  completed.forEach(j => {
    if (!services[j.service]) services[j.service] = { count: 0, earnings: 0 };
    services[j.service].count += 1;
    services[j.service].earnings += getServicePrice(j.service);
  });
  const topServices = Object.entries(services).sort((a, b) => b[1].count - a[1].count);
  const completionRate = jobs.length > 0 ? Math.round((completed.length / jobs.length) * 100) : 0;

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={st.scroll}>
        <Text style={st.title}>Analytics</Text>

        <View style={st.kpiRow}>
          <View style={st.kpi}>
            <Text style={st.kpiNum}>{jobs.length}</Text>
            <Text style={st.kpiLabel}>Total Jobs</Text>
          </View>
          <View style={st.kpi}>
            <Text style={st.kpiNum}>{completed.length}</Text>
            <Text style={st.kpiLabel}>Completed</Text>
          </View>
          <View style={st.kpi}>
            <Text style={st.kpiNum}>{completionRate}%</Text>
            <Text style={st.kpiLabel}>Rate</Text>
          </View>
        </View>

        <Card>
          <Text style={st.cardTitle}>Earnings</Text>
          <View style={st.earningsRow}>
            <View style={{ flex: 1 }}>
              <Text style={st.earningsAmount}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
              <Text style={st.earningsSub}>Total earnings from {completed.length} completed jobs</Text>
            </View>
            <View style={st.avgBox}>
              <Text style={st.avgNum}>₹{avgPerJob}</Text>
              <Text style={st.avgLabel}>Avg/job</Text>
            </View>
          </View>
          {totalEarnings === 0 && serviceDetails.filter(s => s.enabled).length === 0 && (
            <Text style={st.hint}>Set your service prices in Profile to track earnings here</Text>
          )}
        </Card>

        <Card>
          <Text style={st.cardTitle}>Current Status</Text>
          <View style={st.statusRow}>
            <View style={st.statusItem}>
              <View style={[st.statusDot, { backgroundColor: colors.success }]} />
              <Text style={st.statusText}>{inProgress.length} In Progress</Text>
            </View>
            <View style={st.statusItem}>
              <View style={[st.statusDot, { backgroundColor: colors.textMuted }]} />
              <Text style={st.statusText}>{completed.length} Completed</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={st.cardTitle}>Service Breakdown</Text>
          {topServices.length === 0 ? (
            <Text style={st.noData}>Complete jobs to see breakdown</Text>
          ) : topServices.map(([name, data], i) => (
            <View key={name} style={st.barRow}>
              <Text style={st.barLabel}>{name}</Text>
              <View style={st.barBg}>
                <View style={[st.barFill, { width: (data.count / (topServices[0]?.[1]?.count || 1)) * 100 + '%' }]} />
              </View>
              <View style={st.barStats}>
                <Text style={st.barCount}>{data.count}</Text>
                <Text style={st.barEarnings}>₹{data.earnings.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={st.cardTitle}>Insights</Text>
          {topServices.length > 0 ? (
            <View>
              <Text style={st.insight}>Your most popular service is {topServices[0][0]} with {topServices[0][1].count} completed jobs bringing in ₹{topServices[0][1].earnings.toLocaleString('en-IN')}.</Text>
              {completionRate >= 80 && <Text style={[st.insight, { marginTop: spacing.sm }]}>Great completion rate of {completionRate}%! This builds trust with pet owners.</Text>}
            </View>
          ) : (
            <Text style={st.noData}>Complete more jobs to unlock insights</Text>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: 100 },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  kpiRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  kpi: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  kpiNum: { color: colors.accent, fontSize: fontSize.xxl, fontWeight: '900' },
  kpiLabel: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 4 },
  cardTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: spacing.md },
  earningsRow: { flexDirection: 'row', alignItems: 'center' },
  earningsAmount: { color: colors.success, fontSize: fontSize.xxxl, fontWeight: '900' },
  earningsSub: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 4 },
  avgBox: { backgroundColor: colors.accentLight, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  avgNum: { color: colors.accent, fontSize: fontSize.lg, fontWeight: '800' },
  avgLabel: { color: colors.textSecondary, fontSize: fontSize.xs },
  hint: { color: colors.textMuted, fontSize: fontSize.xs, fontStyle: 'italic', marginTop: spacing.md },
  statusRow: { gap: spacing.sm },
  statusItem: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  statusText: { color: colors.textSecondary, fontSize: fontSize.sm },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  barLabel: { color: colors.textSecondary, fontSize: fontSize.sm, width: 80 },
  barBg: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginHorizontal: spacing.sm },
  barFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 4 },
  barStats: { alignItems: 'flex-end', width: 60 },
  barCount: { color: colors.text, fontSize: fontSize.sm, fontWeight: '700' },
  barEarnings: { color: colors.success, fontSize: fontSize.xs },
  insight: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 20 },
  noData: { color: colors.textMuted, fontSize: fontSize.sm, fontStyle: 'italic' },
});
