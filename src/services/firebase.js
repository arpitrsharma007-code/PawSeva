import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCHTvz2VdqhNeB2JU1T9NJd7KQsOw7dFf8',
  authDomain: 'pawconnect-cde5d.firebaseapp.com',
  projectId: 'pawconnect-cde5d',
  storageBucket: 'pawconnect-cde5d.firebasestorage.app',
  messagingSenderId: '1058135022410',
  appId: '1:1058135022410:web:05d6bc45b5b612581c7fb3',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export default app;
