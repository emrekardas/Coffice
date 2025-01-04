import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // MongoDB ile kullanıcı senkronizasyonu
  async function syncUserWithMongoDB(user) {
    if (!user) return null;

    try {
      const response = await axios.post('/api/auth/sync-user', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      
      return response.data;
    } catch (error) {
      console.error('MongoDB sync error:', error);
      return null;
    }
  }

  // Kayıt ol
  async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await syncUserWithMongoDB(userCredential.user);
    return userCredential;
  }

  // Email ile giriş yap
  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await syncUserWithMongoDB(userCredential.user);
    return userCredential;
  }

  // Google ile giriş yap
  async function signInWithGoogle() {
    const userCredential = await signInWithPopup(auth, googleProvider);
    await syncUserWithMongoDB(userCredential.user);
    return userCredential;
  }

  // Çıkış yap
  function logout() {
    return signOut(auth);
  }

  // Şifre sıfırlama
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Kullanıcı durumunu izle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const mongoUser = await syncUserWithMongoDB(user);
        setCurrentUser({ ...user, mongoData: mongoUser });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 