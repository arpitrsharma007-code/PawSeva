import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import { Card, Tag, Button, EmptyState } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToShopJobs, updateRequestStatus } from '../../services/requestService';

const STATUS_COLORS = { accepted: colors.info, 'in-progress': colors.success, completed: colors.textMuted };

export default function ShopHistoryScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToShopJobs(user.uid, setJobs);
    return unsub;
  }, [user]);

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      await updateRequestStatus(jobId, newStatus);
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const completedCount = jobs.filter(j => j.status === 'completed').length;

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={st.scroll}>
        <Text style={st.title}>Job History</Text>
        <View style={st.statsRow}>
          <View style={st.stat}><Text style={st.statNum}>{jobs.length}</Text><Text style={st.statLabel}>Total Jobs</Text></View>
          <View style={[st.stat, { marginLeft: spacing.md }]}><Text style={st.statNum}>{completedCount}</Text><Text style={st.statLabel}>Completed</Text></View>
        </View>

        {jobs.length === 0 ? (
          <EmptyState icon="📋" title="No jobs yet" subtitle="Accept requests from the Dashboard to see them here" />
        ) : jobs.map(job => (
          <Card key={job.id}>
            <View style={st.row}>
              <View style={{ flex: 1 }}>
                <Text style={st.service}>{job.service}</Text>
                <Text style={st.detail}>{job.ownerName} - {job.petName}</Text>
                <Text style={st.date}>{job.preferredDate} at {job.preferredTime}</Text>
              </View>
              <Tag label={job.status} color={STATUS_COLORS[job.status] || colors.accent} />
            </View>
            {job.status === 'accepted' && (
              <Button title="Start Job" onPress={() => handleStatusUpdate(job.id, 'in-progress')}
                style={{ marginTop: spacing.md, backgroundColor: colors.accent, borderRadius: 10 }} />
            )}
            {job.status === 'in-progress' && (
              <Button title="Mark Complete" onPress={() => handleStatusUpdate(job.id, 'completed')}
                variant="outline" style={{ marginTop: spacing.md, borderRadius: 10 }} />
            )}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: 100 },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', marginBottom: spacing.xl },
  stat: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, flex: 1, borderWidth: 1, borderColor: colors.border },
  statNum: { color: colors.accent, fontSize: fontSize.xxxl, fontWeight: '900' },
  statLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  service: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  detail: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 },
  date: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
});
