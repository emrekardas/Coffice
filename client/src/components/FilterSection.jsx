import PropTypes from 'prop-types';
import { StarIcon, WifiIcon, BoltIcon, TableCellsIcon } from '@heroicons/react/24/outline';

const FilterSection = ({ filters, onFilterChange }) => {
  const amenities = [
    { id: 'wifi', label: 'WiFi', icon: WifiIcon },
    { id: 'power', label: 'Power Outlets', icon: BoltIcon },
    { id: 'seating', label: 'Comfortable Seating', icon: TableCellsIcon },
  ];

  const priceRanges = [
    { id: '£', label: 'Budget' },
    { id: '££', label: 'Moderate' },
    { id: '£££', label: 'Premium' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onFilterChange({ target: { name: 'rating', value: rating.toString() } })}
                className={`inline-flex items-center p-2 rounded-md ${
                  filters.rating === rating.toString()
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors duration-200`}
              >
                <StarIcon className="h-5 w-5" />
                <span className="ml-1">{rating}+</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="flex items-center space-x-2">
            {priceRanges.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onFilterChange({ target: { name: 'priceRange', value: id } })}
                className={`px-4 py-2 rounded-md ${
                  filters.priceRange === id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors duration-200`}
              >
                <span className="font-medium">{id}</span>
                <span className="ml-1 text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amenities Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {amenities.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() =>
                  onFilterChange({
                    target: {
                      name: 'amenities',
                      value: filters.amenities.includes(id)
                        ? filters.amenities.filter((a) => a !== id)
                        : [...filters.amenities, id],
                    },
                  })
                }
                className={`inline-flex items-center px-3 py-2 rounded-md ${
                  filters.amenities.includes(id)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors duration-200`}
              >
                <Icon className="h-5 w-5 mr-1" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.rating || filters.priceRange || filters.amenities.length > 0) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
            <button
              onClick={() =>
                onFilterChange({
                  target: {
                    name: 'reset',
                    value: {
                      rating: '',
                      priceRange: '',
                      amenities: [],
                    },
                  },
                })
              }
              className="text-sm text-primary hover:text-primary-dark transition-colors duration-200"
            >
              Clear all filters
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {filters.rating && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                {filters.rating}+ Stars
                <button
                  onClick={() => onFilterChange({ target: { name: 'rating', value: '' } })}
                  className="ml-2 hover:text-primary-dark"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priceRange && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                {priceRanges.find((p) => p.id === filters.priceRange)?.label}
                <button
                  onClick={() => onFilterChange({ target: { name: 'priceRange', value: '' } })}
                  className="ml-2 hover:text-primary-dark"
                >
                  ×
                </button>
              </span>
            )}
            {filters.amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
              >
                {amenities.find((a) => a.id === amenity)?.label}
                <button
                  onClick={() =>
                    onFilterChange({
                      target: {
                        name: 'amenities',
                        value: filters.amenities.filter((a) => a !== amenity),
                      },
                    })
                  }
                  className="ml-2 hover:text-primary-dark"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

FilterSection.propTypes = {
  filters: PropTypes.shape({
    rating: PropTypes.string,
    priceRange: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterSection; 