import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' veya 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'register' && password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    try {
      const endpoint = activeTab === 'login' ? 'login' : 'register';
      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${activeTab === 'login' ? 'Giriş yapılamadı' : 'Kayıt oluşturulamadı'}`);
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    error && error.includes('email') ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-indigo-600`}
                  placeholder="E-posta adresi"
                />
                {error && error.includes('email') && (
                  <p className="mt-1 text-xs text-red-500">
                    Geçerli bir e-posta adresi girmelisiniz.
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  placeholder="Şifre"
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
                  />
                </div>
              )}

              {error && !error.includes('email') && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              {activeTab === 'login' && (
                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                    onClick={(e) => {
                      e.preventDefault();
                      // Şifremi unuttum fonksiyonu
                    }}
                  >
                    Şifremi unuttum
                  </a>
                </div>
              )}

              <button
                type="submit"
                style={{ backgroundColor: 'rgb(67 56 202)' }}
                className="w-full py-2 px-4 border border-transparent rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                {activeTab === 'login' ? 'Giriş yap' : 'Üye ol'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">veya</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  <div className="flex items-center justify-center">
                    <span className="ml-2">Telefon numarası ile giriş yap</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 