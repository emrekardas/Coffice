import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kayıt ol
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Email ile giriş yap
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google ile giriş yap
  function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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