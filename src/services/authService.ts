import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { app } from '../firebaseConfig';

// Handle anonymous login
export const anonymousLogin = async () => {
  const auth = getAuth(app);
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
};

// Handle logout
export const logout = async () => {
  const auth = getAuth(app);
  await signOut(auth);
};
