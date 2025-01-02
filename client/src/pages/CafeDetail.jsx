import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPinIcon, HeartIcon, ShareIcon, GlobeAltIcon, CurrencyPoundIcon, ChatBubbleLeftIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import StarRating from '../components/StarRating';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const CafeDetail = () => {
  const { id } = useParams();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    navigator.share({
      title: cafe.title,
      text: `Check out ${cafe.title} on Coffice!`,
      url: window.location.href
    }).catch(console.error);
  };

  const getImageNumber = (id) => {
    const numericValue = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (numericValue % 1257) + 1;
  };

  const createGoogleMapsUrl = (address) => {
    if (!address) return null;
    if (address.includes('maps.google.com') || address.includes('google.com/maps')) {
      return address;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const extractLocation = (address) => {
    if (!address) return "London";
    
    if (address.includes("maps")) {
      const locationMatch = address.match(/place\/([^/]+)/);
      if (locationMatch && locationMatch[1]) {
        const location = decodeURIComponent(locationMatch[1])
          .replace(/\+/g, ' ')
          .split(',')[0]
          .replace(/WatchHouse|Coffee|Shop|Cafe/gi, '')
          .trim();
        return location || "London";
      }
    }
    
    const firstPart = address.split(',')[0].trim();
    return firstPart || "London";
  };

  useEffect(() => {
    const fetchCafeDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:3000/api/cafes/${id}`);
        setCafe(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load cafe details.');
        console.error('Error fetching cafe details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCafeDetail();
  }, [id]);

  if (loading || error || !cafe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-16 bg-white shadow-sm"></div> {/* Header placeholder */}
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          {loading && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-sm">
              {error}
            </div>
          )}
          {!cafe && !loading && !error && (
            <div className="text-gray-600">Cafe not found.</div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  const mapsUrl = createGoogleMapsUrl(cafe["Google Maps Link"] || cafe.address);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] bg-gray-900">
          {/* Back Button - Absolute positioned over hero */}
          <div className="absolute top-6 left-4 z-10">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white transition-all duration-200 shadow-lg"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Cafes
            </Link>
          </div>

          {/* Hero Content */}
          <div className="relative h-full">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <span className="text-gray-400">Image unavailable</span>
              </div>
            ) : (
              <>
                <img
                  src={`https://coffee.alexflipnote.dev/${getImageNumber(cafe._id)}.png`}
                  alt={cafe.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-50'
                  }`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50"></div>
              </>
            )}

            {/* Hero Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {cafe.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white">
                  <div className="flex items-center">
                    <StarRating rating={parseFloat(cafe.rating)} />
                    {cafe.reviews && (
                      <span className="ml-2 text-gray-300">
                        ({cafe.reviews} reviews)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-300 mr-1" />
                    <span className="text-gray-300">
                      {extractLocation(cafe["Google Maps Link"] || cafe.address)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-6 right-4 z-10 flex space-x-2">
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-primary text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                } shadow-lg hover:scale-105`}
              >
                <HeartIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg hover:bg-white hover:scale-105 transition-all duration-200"
              >
                <ShareIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Info Cards */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="font-semibold text-gray-900 mb-2">Location</h2>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center"
                      >
                        {extractLocation(cafe["Google Maps Link"] || cafe.address)}
                        <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {cafe.website && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <GlobeAltIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h2 className="font-semibold text-gray-900 mb-2">Website</h2>
                        <a
                          href={cafe.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center"
                        >
                          Visit Website
                          <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="space-y-6">
                {cafe.price_range && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <CurrencyPoundIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h2 className="font-semibold text-gray-900 mb-2">Price Range</h2>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">{cafe.price_range}</span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-500 text-sm">
                            {cafe.price_range === '£' ? 'Budget Friendly' : 
                             cafe.price_range === '££' ? 'Moderately Priced' : 'Premium'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {cafe.reviews && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <ChatBubbleLeftIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h2 className="font-semibold text-gray-900 mb-2">Reviews</h2>
                        <div className="flex items-center space-x-2">
                          <StarRating rating={parseFloat(cafe.rating)} />
                          <span className="text-gray-600">
                            {cafe.reviews} reviews
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About this Space</h2>
              <div className="prose prose-primary max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {cafe.title} is a welcoming coffee shop located in {extractLocation(cafe["Google Maps Link"] || cafe.address)}, 
                  perfect for remote work, studying, or casual meetings. With its {cafe.price_range} pricing and 
                  {parseFloat(cafe.rating) >= 4.5 ? ' exceptional' : parseFloat(cafe.rating) >= 4.0 ? ' great' : ' good'} rating, 
                  this cafe has received {cafe.reviews} positive reviews from visitors, making it a popular choice among 
                  London's coffee enthusiasts and remote workers alike.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section - Coming soon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Map component will be added here */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CafeDetail; 