import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  totalStars?: number;
  onChange?: (value: number) => void;
}

export default function StarRating({ totalStars = 5, onChange }: StarRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);

  const handleClick = (value: number) => {
    setRating(value);
    onChange?.(value);
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
