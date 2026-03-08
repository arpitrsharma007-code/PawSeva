import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import { Card, Button, CountdownTimer, EmptyState, Tag } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToPendingRequests, acceptRequest } from '../../services/requestService';

export default function ShopDashboardScreen() {
  const { user, userData } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsub = subscribeToPendingRequests(setRequests);
    return unsub;
  }, []);

  const getMyPrice = (serviceName) => {
    const details = userData?.serviceDetails || [];
    const svc = details.find(s => s.name === serviceName && s.enabled);
    if (!svc) return null;
    if (svc.priceType === 'fixed' && svc.fixedPrice) return '\u20B9' + svc.fixedPrice;
    if (svc.priceType === 'range' && svc.minPrice && svc.maxPrice) return '\u20B9' + svc.minPrice + ' - \u20B9' + svc.maxPrice;
    if (svc.priceType === 'range' && svc.minPrice) return 'From \u20B9' + svc.minPrice;
    return null;
  };

  const handleAccept = async (req) => {
    try {
      const price = getMyPrice(req.service);
      await acceptRequest(req.id, {
        uid: user.uid,
        businessName: userData?.businessName,
        name: userData?.name,
        price: price,
      });
      Alert.alert('Accepted!', 'You have accepted the request from ' + req.ownerName);
    } catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={st.scroll}>
        <Text style={st.title}>Dashboard</Text>
        <Text style={st.sub}>{userData?.businessName || 'Your Shop'}</Text>

        <View style={st.statsRow}>
          <View style={st.stat}>
            <Text style={st.statNum}>{requests.length}</Text>
            <Text style={st.statLabel}>Pending</Text>
          </View>
        </View>

        {requests.length === 0 ? (
          <EmptyState icon=" 📭 " title="No pending requests" subtitle="New requests from pet owners will appear here" />
        ) : requests.map(req => {
          const myPrice = getMyPrice(req.service);
          return (
            <Card key={req.id} style={{ marginBottom: spacing.lg }}>
              <View style={st.reqHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={st.reqService}>{req.service}</Text>
                  <Text style={st.reqOwner}>{req.ownerName}</Text>
                </View>
                <Tag label="New" color={colors.accent} />
              </View>
              <Text style={st.reqDetail}>{req.petName} ({req.petType})</Text>
              <Text style={st.reqDetail}>{req.preferredDate} at {req.preferredTime}</Text>
              {req.location?.address && <Text style={st.reqLoc}>{req.location.address}</Text>}
              {req.notes ? <Text style={st.reqNotes}>{req.notes}</Text> : null}
              {myPrice && (
                <View style={st.priceTag}>
                  <Text style={st.priceLabel}>Your price:</Text>
                  <Text style={st.priceValue}>{myPrice}</Text>
                </View>
              )}
              <View style={st.timerRow}>
                <CountdownTimer seconds={60} onExpire={() => {}} />
              </View>
              <View style={st.btnRow}>
                <Button title="Accept" onPress={() => handleAccept(req)} style={{ flex: 1, marginRight: spacing.sm }} />
                <Button title="Skip" variant="secondary" onPress={() => {}} style={{ flex: 1 }} />
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: 100 },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  sub: { fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.xl },
  statsRow: { flexDirection: 'row', marginBottom: spacing.xl },
  stat: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, flex: 1, borderWidth: 1, borderColor: colors.border },
  statNum: { color: colors.accent, fontSize: fontSize.xxxl, fontWeight: '900' },
  statLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  reqHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.sm },
  reqService: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  reqOwner: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '600' },
  reqDetail: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 },
  reqLoc: { color: colors.info, fontSize: fontSize.xs, marginTop: 4 },
  reqNotes: { color: colors.textMuted, fontSize: fontSize.xs, fontStyle: 'italic', marginTop: 4 },
  priceTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successLight, borderRadius: radius.sm, padding: spacing.sm, marginTop: spacing.sm, alignSelf: 'flex-start' },
  priceLabel: { color: colors.textSecondary, fontSize: fontSize.xs, marginRight: spacing.xs },
  priceValue: { color: colors.success, fontSize: fontSize.sm, fontWeight: '800' },
  timerRow: { marginVertical: spacing.md },
  btnRow: { flexDirection: 'row', marginTop: spacing.sm },
});
