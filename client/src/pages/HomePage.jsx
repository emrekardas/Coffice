import { useState, useEffect } from 'react';
import axios from 'axios';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import CafeList from '../components/CafeList';
import FilterSection from '../components/FilterSection';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
      const response = await axios.get('http://127.0.0.1:3000/api/cafes', {
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
      
      const url = `http://127.0.0.1:3000/api/cafes${newFilters.rating ? '/filter' : ''}?${params}`;
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
        <div className="flex items-center justify-center min-h-[60vh]">
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
      <div className="relative bg-primary text-white pt-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Coffee shop background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Perfect Coffice Space
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
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
                className="block w-full pl-10 pr-3 py-3 text-base placeholder-gray-500 border border-transparent rounded-l-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white focus:border-white text-gray-900"
              />
            </div>
            <button
              type="submit"
              className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-r-lg text-white bg-primary-dark hover:bg-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors duration-200"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filter Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {loading ? 'Loading...' : `${cafes.length} Spaces Found`}
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <FilterSection filters={filters} onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Cafe List */}
        <CafeList cafes={cafes} loading={loading} />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage; 