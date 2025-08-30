import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  totalStars?: number;
  rating: number;               
  onChange?: (value: number) => void;
}

export default function StarRating({ totalStars = 5, rating, onChange }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  const handleClick = (value: number) => {
    onChange?.(value); // Parent handles the state now
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length: totalStars }, (_, index) => {
        const value = index + 1;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                value <= (hover ?? rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
