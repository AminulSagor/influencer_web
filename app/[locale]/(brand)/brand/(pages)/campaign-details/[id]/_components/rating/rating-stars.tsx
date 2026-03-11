"use client";

import { Star } from "lucide-react";
import { MAX_RATING } from "./rating-card.utils";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
};

export default function RatingStars({
  value,
  onChange,
  readonly = false,
  size = 26,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: MAX_RATING }).map((_, index) => {
        const starValue = index + 1;
        const active = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(starValue)}
            className={cn(
              "transition-transform",
              readonly ? "cursor-default" : "hover:scale-105"
            )}
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "shrink-0",
                active
                  ? "fill-[#F4C400] text-[#F4C400]"
                  : "fill-white text-white"
              )}
              style={{ width: size, height: size }}
            />
          </button>
        );
      })}
    </div>
  );
}