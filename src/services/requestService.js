import { db } from './firebase';
import {
  collection, addDoc, doc, updateDoc, onSnapshot,
  query, where, orderBy, serverTimestamp, getDoc, getDocs,
} from 'firebase/firestore';

export const createRequest = async (requestData) => {
  const docRef = await addDoc(collection(db, 'requests'), {
    ...requestData,
    status: 'pending',
    createdAt: serverTimestamp(),
    offers: [],
    acceptedShopId: null,
  });
  return docRef.id;
};

// FIXED: Single-field queries to avoid composite index requirement
export const subscribeToOwnerRequests = (ownerId, callback) => {
  const q = query(collection(db, 'requests'), where('ownerId', '==', ownerId));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    callback(data);
  }, (err) => { console.log('Owner requests error:', err); callback([]); });
};

export const subscribeToPendingRequests = (callback) => {
  const q = query(collection(db, 'requests'), where('status', '==', 'pending'));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    callback(data);
  }, (err) => { console.log('Pending requests error:', err); callback([]); });
};

export const subscribeToShopJobs = (shopId, callback) => {
  const q = query(collection(db, 'requests'), where('acceptedShopId', '==', shopId));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    callback(data);
  }, (err) => { console.log('Shop jobs error:', err); callback([]); });
};

export const acceptRequest = async (requestId, shopData) => {
  const ref = doc(db, 'requests', requestId);
  await updateDoc(ref, {
    status: 'accepted',
    acceptedShopId: shopData.uid,
    acceptedShopName: shopData.businessName || shopData.name,
    acceptedAt: serverTimestamp(),
  });
};

export const updateRequestStatus = async (requestId, status) => {
  await updateDoc(doc(db, 'requests', requestId), { status });
};

export const getRequest = async (requestId) => {
  const snap = await getDoc(doc(db, 'requests', requestId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};
