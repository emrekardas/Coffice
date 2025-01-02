import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';

const StarRating = ({ rating, showScore = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return (
            <SolidStarIcon key={index} className="h-5 w-5 text-yellow-400" />
          );
        } else if (index === fullStars && hasHalfStar) {
          return (
            <div key={index} className="relative h-5 w-5">
              <OutlineStarIcon className="absolute h-5 w-5 text-yellow-400" />
              <div className="absolute h-5 w-[10px] overflow-hidden">
                <SolidStarIcon className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          );
        } else {
          return (
            <OutlineStarIcon key={index} className="h-5 w-5 text-yellow-400" />
          );
        }
      })}
      {showScore && (
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      )}
    </div>
  );
};

export default StarRating;
