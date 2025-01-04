import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token işlemleri
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Kayıt ol
  async function signup(email, password, username) {
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        username
      });
      
      const { token, user } = response.data;
      setAuthToken(token);
      setCurrentUser(user);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Kayıt işlemi başarısız oldu';
    }
  }

  // Giriş yap
  async function login(login, password) {
    try {
      const response = await axios.post('/api/auth/login', {
        login, // email veya username olabilir
        password
      });
      
      const { token, user } = response.data;
      setAuthToken(token);
      setCurrentUser(user);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Giriş işlemi başarısız oldu';
    }
  }

  // Çıkış yap
  function logout() {
    setAuthToken(null);
    setCurrentUser(null);
  }

  // Şifre sıfırlama
  async function resetPassword(email) {
    try {
      const response = await axios.post('/api/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Şifre sıfırlama başarısız oldu';
    }
  }

  // Kullanıcı durumunu kontrol et
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      axios.get('/api/auth/me')
        .then(response => {
          setCurrentUser(response.data);
        })
        .catch(() => {
          setAuthToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext; 