import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export default function StarRating({ rating, size = 16, className = '' }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? 'fill-gold-400 text-gold-400'
              : 'fill-charcoal-100 text-charcoal-200'
          }
        />
      ))}
    </div>
  );
}
