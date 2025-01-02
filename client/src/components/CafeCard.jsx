import { MapPinIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import StarRating from './StarRating';
import { useState } from 'react';

const CafeCard = ({ cafe }) => {
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

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement share functionality
    navigator.share({
      title: cafe.title,
      text: `Check out ${cafe.title} on Coffice!`,
      url: window.location.href
    }).catch(console.error);
  };

  return (
    <div className="card group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
      <Link to={`/cafe/${cafe._id}`} className="flex flex-col h-full">
        <div className="relative h-40 sm:h-44 md:h-48">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-sm text-gray-500">Image unavailable</span>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src="https://coffee.alexflipnote.dev/random"
                alt={cafe.title}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`p-1.5 sm:p-2 rounded-full ${
                    isFavorite ? 'bg-primary text-white' : 'bg-white text-gray-600'
                  } shadow-md hover:scale-110 transition-all duration-200`}
                >
                  <HeartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-1.5 sm:p-2 rounded-full bg-white text-gray-600 shadow-md hover:scale-110 transition-all duration-200"
                >
                  <ShareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200 truncate max-w-[80%]" title={cafe.title}>
              {cafe.title}
            </h2>
            <StarRating rating={parseFloat(cafe.rating)} />
          </div>
          <div className="mt-1 sm:mt-2">
            <div className="flex items-start text-gray-500">
              <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 mt-0.5 text-primary flex-shrink-0" />
              <a
                href={cafe["Google Maps Link"]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base hover:text-primary transition-colors duration-200 truncate"
                onClick={(e) => e.stopPropagation()}
                title={extractLocation(cafe["Google Maps Link"] || cafe.address)}
              >
                {extractLocation(cafe["Google Maps Link"] || cafe.address)}
              </a>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
            {cafe.reviews && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gray-100 text-xs sm:text-sm text-gray-600 hover:bg-gray-200 transition-colors duration-200">
                {cafe.reviews} reviews
              </span>
            )}
            {cafe.price_range && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gray-100 text-xs sm:text-sm text-gray-600 hover:bg-gray-200 transition-colors duration-200">
                {cafe.price_range}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

CafeCard.propTypes = {
  cafe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.string.isRequired,
    reviews: PropTypes.string,
    address: PropTypes.string,
    image: PropTypes.string,
    "Google Maps Link": PropTypes.string,
    price_range: PropTypes.string
  }).isRequired
};

export default CafeCard; 