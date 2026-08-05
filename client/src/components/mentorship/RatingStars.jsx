import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating = 5 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} size={16} className="fill-brand-gold text-brand-gold" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<StarHalf key={i} size={16} className="fill-brand-gold text-brand-gold" />);
    } else {
      stars.push(<Star key={i} size={16} className="text-zinc-600" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="text-xs font-semibold text-zinc-300 ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;
