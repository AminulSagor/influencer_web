import { Star, StarHalf } from "lucide-react";

type Props = {
  rating: number;
};

export default function RatingStars({ rating }: Props) {
  const stars = [];

  for (let i = 1; i <= 5; i += 1) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />,
      );
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(
        <StarHalf
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />,
      );
    } else {
      stars.push(<Star key={i} className="h-4 w-4 text-white/60" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}