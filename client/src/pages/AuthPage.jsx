import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Alert from '../components/Alert';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, login, resetPassword } = useAuth();

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const clearAlert = () => {
    setAlert(null);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    clearAlert();
    setLoading(true);

    try {
      if (activeTab === 'register') {
        if (password !== confirmPassword) {
          setLoading(false);
          showAlert('error', 'Şifreler eşleşmiyor');
          return;
        }
        if (password.length < 6) {
          setLoading(false);
          showAlert('error', 'Şifre en az 6 karakter olmalıdır');
          return;
        }
        if (username.length < 3) {
          setLoading(false);
          showAlert('error', 'Kullanıcı adı en az 3 karakter olmalıdır');
          return;
        }
        await signup(email, password, username);
        showAlert('success', 'Kayıt başarılı! Yönlendiriliyorsunuz...');
      } else {
        await login(email, password);
        showAlert('success', 'Giriş başarılı! Yönlendiriliyorsunuz...');
      }
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      showAlert('error', error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    
    if (!email) {
      return showAlert('error', 'Şifre sıfırlamak için email adresinizi girin');
    }

    try {
      clearAlert();
      setLoading(true);
      await resetPassword(email);
      showAlert('success', 'Şifre sıfırlama linki email adresinize gönderildi');
    } catch (error) {
      showAlert('error', error.message || 'Şifre sıfırlama başarısız oldu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={clearAlert}
        />
      )}
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none ${
                activeTab === 'login'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Giriş yap
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none ${
                activeTab === 'register'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Üye ol
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    placeholder="Kullanıcı Adı"
                    minLength={3}
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  placeholder="E-posta adresi"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  placeholder="Şifre"
                  minLength={6}
                />
              </div>

              {activeTab === 'register' && (
                <div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    placeholder="Şifre Tekrar"
                    minLength={6}
                  />
                </div>
              )}

              {activeTab === 'login' && (
                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                    onClick={handleResetPassword}
                  >
                    Şifremi unuttum
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: 'rgb(67 56 202)' }}
                className="w-full py-2 px-4 border border-transparent rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50"
              >
                {loading ? 'Lütfen bekleyin...' : activeTab === 'login' ? 'Giriş yap' : 'Üye ol'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 