import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (!userData.isAdmin) {
      navigate('/');
      return;
    }

    setUser(userData);
  }, [navigate]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Dosya yükleme başarısız');
      }

      alert('Dosya başarıyla yüklendi');
    } catch (error) {
      alert('Hata: ' + error.message);
    }
  };

  if (!user) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-100">
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Admin Paneli
              </h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        JSON Dosyası Yükle
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Yeni kafe verilerini içeren JSON dosyasını yükleyin.
                      </p>
                      <div className="mt-4">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                        />
                      </div>
                    </div>

                    <div className="mt-10">
                      <h2 className="text-lg font-medium text-gray-900">
                        Diğer İşlemler
                      </h2>
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Buraya diğer admin işlemleri için kartlar eklenebilir */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
} 