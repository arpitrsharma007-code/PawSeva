import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Switch, Alert, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import { Card, Button } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../services/authService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { ALL_SERVICES } from '../../utils/services';

export default function ShopProfileScreen() {
  const { user, userData, setUserData } = useAuth();
  const [isOnline, setIsOnline] = useState(userData?.isOnline ?? true);
  const [editingServices, setEditingServices] = useState(false);

  // services stored as: [{ key, name, enabled, priceType, fixedPrice, minPrice, maxPrice }]
  const getServiceData = () => {
    const saved = userData?.serviceDetails || [];
    return ALL_SERVICES.map(svc => {
      const existing = saved.find(s => s.key === svc.key);
      return existing || { key: svc.key, name: svc.name, enabled: false, priceType: 'fixed', fixedPrice: '', minPrice: '', maxPrice: '' };
    });
  };

  const [serviceData, setServiceData] = useState(getServiceData());

  const toggleOnline = async (val) => {
    setIsOnline(val);
    try {
      await updateDoc(doc(db, 'users', user.uid), { isOnline: val });
      setUserData(prev => ({ ...prev, isOnline: val }));
    } catch (e) { console.log(e); }
  };

  const toggleService = (key) => {
    setServiceData(prev => prev.map(s => s.key === key ? { ...s, enabled: !s.enabled } : s));
  };

  const updateServiceField = (key, field, value) => {
    setServiceData(prev => prev.map(s => s.key === key ? { ...s, [field]: value } : s));
  };

  const saveServices = async () => {
    try {
      const enabled = serviceData.filter(s => s.enabled);
      const serviceNames = enabled.map(s => s.name);
      await updateDoc(doc(db, 'users', user.uid), {
        serviceDetails: serviceData,
        services: serviceNames,
      });
      setUserData(prev => ({ ...prev, serviceDetails: serviceData, services: serviceNames }));
      setEditingServices(false);
      Alert.alert('Saved!', 'Your services and prices have been updated');
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const enabledCount = serviceData.filter(s => s.enabled).length;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Logout', style: 'destructive', onPress: logoutUser },
    ]);
  };

  const getSvcMeta = (key) => ALL_SERVICES.find(s => s.key === key) || {};

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={st.scroll} keyboardShouldPersistTaps="handled">
        <Text style={st.title}>Shop Profile</Text>

        <Card>
          <Text style={st.name}>{userData?.businessName || userData?.name || 'Shop'}</Text>
          <Text style={st.email}>{userData?.email}</Text>
          {userData?.phone ? <Text style={st.email}>{userData.phone}</Text> : null}
        </Card>

        <Card>
          <View style={st.onlineRow}>
            <View>
              <Text style={st.onlineLabel}>Online Status</Text>
              <Text style={st.onlineSub}>{isOnline ? 'Accepting new requests' : 'Not accepting requests'}</Text>
            </View>
            <Switch value={isOnline} onValueChange={toggleOnline}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={isOnline ? '#fff' : colors.textMuted} />
          </View>
        </Card>

        <Card>
          <View style={st.svcHeader}>
            <View>
              <Text style={st.sectionTitle}>Services & Pricing</Text>
              <Text style={st.svcCount}>{enabledCount} services enabled</Text>
            </View>
            <TouchableOpacity onPress={() => editingServices ? saveServices() : setEditingServices(true)}>
              <Text style={st.editBtn}>{editingServices ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          {!editingServices ? (
            serviceData.filter(s => s.enabled).length === 0 ? (
              <Text style={st.noData}>No services configured. Tap Edit to add services and set your prices.</Text>
            ) : serviceData.filter(s => s.enabled).map(svc => {
              const meta = getSvcMeta(svc.key);
              const priceText = svc.priceType === 'range'
                ? (svc.minPrice && svc.maxPrice ? '₹' + svc.minPrice + ' - ₹' + svc.maxPrice : 'Price not set')
                : (svc.fixedPrice ? '₹' + svc.fixedPrice : 'Price not set');
              return (
                <View key={svc.key} style={st.svcItem}>
                  <View style={[st.svcDot, { backgroundColor: meta.color || colors.accent }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={st.svcName}>{svc.name}</Text>
                    <Text style={st.svcPrice}>{priceText}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            serviceData.map(svc => {
              const meta = getSvcMeta(svc.key);
              return (
                <View key={svc.key} style={st.editItem}>
                  <TouchableOpacity style={st.editRow} onPress={() => toggleService(svc.key)}>
                    <View style={[st.checkbox, svc.enabled && st.checkboxActive]}>
                      {svc.enabled && <Ionicons name="checkmark" size={14} color="#000" />}
                    </View>
                    <View style={[st.svcDot, { backgroundColor: meta.color || colors.accent }]} />
                    <Text style={[st.svcName, !svc.enabled && { opacity: 0.4 }]}>{svc.name}</Text>
                  </TouchableOpacity>

                  {svc.enabled && (
                    <View style={st.priceSection}>
                      <View style={st.priceTypeRow}>
                        <TouchableOpacity
                          style={[st.priceTypeBtn, svc.priceType === 'fixed' && st.priceTypeBtnActive]}
                          onPress={() => updateServiceField(svc.key, 'priceType', 'fixed')}>
                          <Text style={[st.priceTypeText, svc.priceType === 'fixed' && st.priceTypeTextActive]}>Fixed Price</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[st.priceTypeBtn, svc.priceType === 'range' && st.priceTypeBtnActive]}
                          onPress={() => updateServiceField(svc.key, 'priceType', 'range')}>
                          <Text style={[st.priceTypeText, svc.priceType === 'range' && st.priceTypeTextActive]}>Price Range</Text>
                        </TouchableOpacity>
                      </View>

                      {svc.priceType === 'fixed' ? (
                        <View style={st.priceInputRow}>
                          <Text style={st.rupee}>₹</Text>
                          <TextInput style={st.priceInput} value={svc.fixedPrice}
                            onChangeText={(v) => updateServiceField(svc.key, 'fixedPrice', v)}
                            placeholder="e.g. 500" placeholderTextColor={colors.textMuted}
                            keyboardType="numeric" />
                        </View>
                      ) : (
                        <View style={st.rangeRow}>
                          <View style={st.priceInputRow}>
                            <Text style={st.rupee}>₹</Text>
                            <TextInput style={[st.priceInput, { flex: 1 }]} value={svc.minPrice}
                              onChangeText={(v) => updateServiceField(svc.key, 'minPrice', v)}
                              placeholder="Min" placeholderTextColor={colors.textMuted}
                              keyboardType="numeric" />
                          </View>
                          <Text style={st.rangeDash}>to</Text>
                          <View style={st.priceInputRow}>
                            <Text style={st.rupee}>₹</Text>
                            <TextInput style={[st.priceInput, { flex: 1 }]} value={svc.maxPrice}
                              onChangeText={(v) => updateServiceField(svc.key, 'maxPrice', v)}
                              placeholder="Max" placeholderTextColor={colors.textMuted}
                              keyboardType="numeric" />
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })
          )}

          {editingServices && (
            <View style={{ flexDirection: 'row', marginTop: spacing.lg, gap: spacing.sm }}>
              <Button title="Save Services" onPress={saveServices} style={{ flex: 1 }} />
              <Button title="Cancel" variant="secondary" onPress={() => { setServiceData(getServiceData()); setEditingServices(false); }} style={{ flex: 1 }} />
            </View>
          )}
        </Card>

        <Card>
          <Text style={st.sectionTitle}>Stats</Text>
          <Text style={st.statLine}>Total Jobs: {userData?.totalJobs || 0}</Text>
          <Text style={st.statLine}>Rating: {userData?.rating || 'No ratings yet'}</Text>
        </Card>

        <Button title="Logout" variant="danger" onPress={handleLogout} style={{ marginTop: spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: 100 },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  name: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700' },
  email: { color: colors.textSecondary, fontSize: fontSize.md, marginTop: 4 },
  onlineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  onlineLabel: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  onlineSub: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 },
  svcHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  sectionTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  svcCount: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
  editBtn: { color: colors.accent, fontSize: fontSize.md, fontWeight: '700' },
  noData: { color: colors.textMuted, fontSize: fontSize.sm, fontStyle: 'italic', lineHeight: 20 },
  svcItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  svcDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  svcName: { color: colors.text, fontSize: fontSize.md },
  svcPrice: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '600', marginTop: 2 },
  editItem: { borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.md },
  editRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.border, marginRight: spacing.sm, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  priceSection: { marginTop: spacing.sm, marginLeft: 34 },
  priceTypeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  priceTypeBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  priceTypeBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  priceTypeText: { color: colors.textSecondary, fontSize: fontSize.xs, fontWeight: '600' },
  priceTypeTextActive: { color: '#000' },
  priceInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.sm, flex: 1 },
  rupee: { color: colors.accent, fontSize: fontSize.md, fontWeight: '700', marginRight: 4 },
  priceInput: { color: colors.text, fontSize: fontSize.md, paddingVertical: 10, flex: 1 },
  rangeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rangeDash: { color: colors.textMuted, fontSize: fontSize.sm },
  statLine: { color: colors.textSecondary, fontSize: fontSize.md, marginBottom: spacing.xs },
});
