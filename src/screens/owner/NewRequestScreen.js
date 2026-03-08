import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import { Button, InputField, Card } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { createRequest } from '../../services/requestService';
import { getCurrentLocation } from '../../services/locationService';
import { ALL_SERVICES } from '../../utils/services';

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Hamster', 'Turtle', 'Other'];

export default function NewRequestScreen({ navigation, route }) {
  const preSelected = route.params?.service || '';
  const { user, userData } = useAuth();
  const [service, setService] = useState(preSelected);
  const [showPicker, setShowPicker] = useState(!preSelected);
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { detectLocation(); }, []);

  const detectLocation = async () => {
    setLoadingLoc(true);
    const loc = await getCurrentLocation();
    if (!loc.error) setLocation(loc);
    setLoadingLoc(false);
  };

  const handleSubmit = async () => {
    if (!service || !petName || !petType || !date || !time) {
      Alert.alert('Missing Info', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await createRequest({
        ownerId: user.uid,
        ownerName: userData?.name || 'Pet Owner',
        service, petName, petType, notes,
        preferredDate: date, preferredTime: time,
        location: location || { address: 'Not detected' },
      });
      Alert.alert('Request Posted!', 'Nearby shops will be notified. You will see offers soon.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  const selectService = (svc) => {
    setService(svc.name);
    setShowPicker(false);
  };

  const selectedMeta = ALL_SERVICES.find(s => s.name === service);

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />

      {/* Service Picker Modal */}
      <Modal visible={showPicker} animationType="slide" transparent={false}>
        <SafeAreaView style={st.container}>
          <View style={st.pickerHeader}>
            <Text style={st.pickerTitle}>Choose a Service</Text>
            <Text style={st.pickerSub}>Scroll through and pick what your pet needs</Text>
            {service ? (
              <TouchableOpacity onPress={() => setShowPicker(false)} style={st.pickerClose}>
                <Text style={st.pickerCloseText}>Close</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <FlatList
            data={ALL_SERVICES}
            keyExtractor={item => item.key}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={[st.svcOption, service === item.name && st.svcOptionActive]}
                onPress={() => selectService(item)}>
                <View style={[st.svcIcon, { backgroundColor: item.color + '22' }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={[st.svcOptionText, service === item.name && { color: colors.accent }]}>{item.name}</Text>
                {service === item.name && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      <ScrollView contentContainerStyle={st.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.back}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={st.title}>New Request</Text>
        <Text style={st.subtitle}>Fill in details and nearby shops will see your request</Text>

        {/* Service selector */}
        <Text style={st.label}>Service *</Text>
        <TouchableOpacity style={st.svcSelector} onPress={() => setShowPicker(true)}>
          {selectedMeta ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={[st.svcIcon, { backgroundColor: selectedMeta.color + '22', marginRight: spacing.sm }]}>
                <Ionicons name={selectedMeta.icon} size={18} color={selectedMeta.color} />
              </View>
              <Text style={st.svcSelectedText}>{service}</Text>
            </View>
          ) : (
            <Text style={st.svcPlaceholder}>Tap to choose a service</Text>
          )}
          <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <InputField label="Pet Name *" value={petName} onChangeText={setPetName} placeholder="Enter your pet's name" />

        <Text style={st.label}>Pet Type *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.chipScroll}>
          {PET_TYPES.map(t => (
            <TouchableOpacity key={t} style={[st.chip, petType === t && st.chipActive]}
              onPress={() => setPetType(t)}>
              <Text style={[st.chipText, petType === t && st.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <InputField label="Preferred Date *" value={date} onChangeText={setDate} placeholder="e.g. 15 March 2026" />
        <InputField label="Preferred Time *" value={time} onChangeText={setTime} placeholder="e.g. 10:00 AM" />
        <InputField label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="Any special instructions..." multiline />

        <Card style={{ marginTop: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location" size={20} color={loadingLoc ? colors.textMuted : colors.success} />
            <Text style={st.locText}>
              {loadingLoc ? 'Detecting location...' : location ? location.address : 'Location not detected'}
            </Text>
          </View>
          {!location && !loadingLoc && (
            <TouchableOpacity onPress={detectLocation}>
              <Text style={st.retryLoc}>Tap to retry</Text>
            </TouchableOpacity>
          )}
        </Card>

        <Button title="Post Request to Nearby Shops" onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xxl, paddingBottom: 100 },
  back: { marginBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xxl },
  label: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.sm, marginTop: spacing.sm },
  svcSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.lg },
  svcSelectedText: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  svcPlaceholder: { color: colors.textMuted, fontSize: fontSize.md },
  svcIcon: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  chipScroll: { marginBottom: spacing.lg },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, marginRight: spacing.sm },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600' },
  chipTextActive: { color: '#000' },
  locText: { color: colors.textSecondary, fontSize: fontSize.sm, marginLeft: spacing.sm, flex: 1 },
  retryLoc: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '600', marginTop: spacing.sm },
  pickerHeader: { padding: spacing.xxl, paddingBottom: spacing.lg },
  pickerTitle: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  pickerSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  pickerClose: { marginTop: spacing.md },
  pickerCloseText: { color: colors.accent, fontSize: fontSize.md, fontWeight: '700' },
  svcOption: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radius.md, marginBottom: spacing.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  svcOptionActive: { borderColor: colors.accent, backgroundColor: colors.accentLight },
  svcOptionText: { color: colors.text, fontSize: fontSize.md, fontWeight: '600', flex: 1, marginLeft: spacing.md },
});
