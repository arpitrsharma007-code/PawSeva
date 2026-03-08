import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import { Card, Button, InputField } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../services/authService';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function OwnerProfileScreen() {
  const { user, userData, setUserData } = useAuth();
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState('');

  const addPet = async () => {
    if (!newPetName || !newPetType) { Alert.alert('Error', 'Enter pet name and type'); return; }
    try {
      const pet = { name: newPetName, type: newPetType, id: Date.now().toString() };
      await updateDoc(doc(db, 'users', user.uid), { pets: arrayUnion(pet) });
      setUserData(prev => ({ ...prev, pets: [...(prev.pets || []), pet] }));
      setNewPetName('');
      setNewPetType('');
      Alert.alert('Added!', newPetName + ' has been added to your pets');
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Logout', style: 'destructive', onPress: logoutUser },
    ]);
  };

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={st.scroll}>
        <Text style={st.title}>My Profile</Text>
        <Card>
          <Text style={st.name}>{userData?.name || 'Pet Owner'}</Text>
          <Text style={st.email}>{userData?.email}</Text>
          {userData?.phone ? <Text style={st.email}>{userData.phone}</Text> : null}
        </Card>

        <Text style={st.section}>My Pets</Text>
        {(userData?.pets || []).map((pet, i) => (
          <Card key={pet.id || i}>
            <Text style={st.petName}>{pet.name}</Text>
            <Text style={st.petType}>{pet.type}</Text>
          </Card>
        ))}
        {(userData?.pets || []).length === 0 && <Text style={st.noPets}>No pets added yet</Text>}

        <Card style={{ marginTop: spacing.md }}>
          <Text style={st.addTitle}>Add a Pet</Text>
          <InputField label="Pet Name" value={newPetName} onChangeText={setNewPetName} placeholder="e.g. Bruno" />
          <InputField label="Pet Type" value={newPetType} onChangeText={setNewPetType} placeholder="e.g. Dog, Cat, Bird" />
          <Button title="Add Pet" onPress={addPet} variant="outline" />
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
  section: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginTop: spacing.xxl, marginBottom: spacing.md },
  petName: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  petType: { color: colors.textSecondary, fontSize: fontSize.sm },
  noPets: { color: colors.textMuted, fontSize: fontSize.sm, fontStyle: 'italic' },
  addTitle: { color: colors.accent, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.md },
});
