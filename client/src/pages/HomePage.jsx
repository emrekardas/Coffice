import { useState, useEffect } from 'react';
import axios from 'axios';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import CafeList from '../components/CafeList';
import FilterSection from '../components/FilterSection';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = 'https://coffice-web-server.onrender.com';

const HomePage = () => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    rating: '',
    amenities: []
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCafes();
  }, []);

  const fetchCafes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/cafes`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setCafes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching cafes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (newFilters.rating) {
        params.append('rating', newFilters.rating);
      }
      
      const url = `${API_URL}/api/cafes${newFilters.rating ? '/filter' : ''}?${params}`;
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setCafes(response.data);
    } catch (err) {
      setError('Error applying filters');
      console.error('Error filtering cafes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-sm">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Coffee shop background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-40 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Perfect Coffice Space
          </h1>
          <p className="mt-6 text-xl max-w-3xl text-gray-300">
            Discover the best coffee shops in London for remote work, meetings, or study sessions.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 sm:flex max-w-2xl">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location, or amenities..."
                className="block w-full pl-10 pr-3 py-3 text-base placeholder-gray-500 border border-transparent rounded-l-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white focus:border-white text-gray-900 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-r-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary transition-all duration-200 hover:scale-105 shadow-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Filter Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                <span>Loading spaces...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>{cafes.length} Spaces Found</span>
                {searchQuery && (
                  <span className="text-sm text-gray-500">
                    for &quot;{searchQuery}&quot;
                  </span>
                )}
              </div>
            )}
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:scale-105"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8">
            <FilterSection filters={filters} onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Cafe List */}
        <div className="space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="bg-white p-4 rounded-b-lg">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <CafeList cafes={cafes} loading={loading} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage; 