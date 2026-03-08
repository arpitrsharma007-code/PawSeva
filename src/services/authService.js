import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export { auth };

export const registerUser = async ({ email, password, name, role, businessName, phone }) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  const userData = {
    uid: user.uid, email, name, role, phone: phone || '',
    createdAt: serverTimestamp(),
  };
  if (role === 'owner') { userData.pets = []; }
  if (role === 'shop') {
    userData.businessName = businessName || name;
    userData.services = ['Grooming', 'Haircut', 'Vet Checkup'];
    userData.isOnline = true;
    userData.rating = 0;
    userData.totalJobs = 0;
    userData.earnings = 0;
    userData.location = null;
  }
  await setDoc(doc(db, 'users', user.uid), userData);
  return { user, userData };
};

export const loginUser = async ({ email, password }) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists()) throw new Error('User profile not found.');
  return { user, userData: snap.data() };
};

export const logoutUser = () => signOut(auth);
export const subscribeToAuthState = (cb) => onAuthStateChanged(auth, cb);
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};
