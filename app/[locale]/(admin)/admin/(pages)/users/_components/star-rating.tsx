import { Star } from "lucide-react";
import { FaStarHalfAlt } from "react-icons/fa";

type StarRatingProps = {
  rating: number; // e.g. 3.4, 4.5
  max?: number;
};

const StarRating = ({ rating, max = 5 }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;

        if (rating >= starValue) {
          // Full star
          return (
            <Star
              key={i}
              size={20}
              className="fill-yellow-500 text-yellow-500"
            />
          );
        }

        if (rating >= starValue - 0.5) {
          // Half star
          return (
            <FaStarHalfAlt
              key={i}
              size={20}
              className="fill-yellow-500 text-yellow-500"
            />
          );
        }

        // Empty star
        return <Star key={i} size={20} className="text-yellow-500" />;
      })}
    </div>
  );
};

export default StarRating;
