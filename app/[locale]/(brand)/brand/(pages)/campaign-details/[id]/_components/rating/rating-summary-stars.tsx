"use client";

import { Star } from "lucide-react";

type RatingSummaryStarsProps = {
  total?: number;
  active?: number;
  size?: string;
};

export default function RatingSummaryStars({
  total = 5,
  active = 0,
  size = "h-11 w-11 md:h-[44px] md:w-[44px]",
}: RatingSummaryStarsProps) {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index < active;

        return (
          <Star
            key={index}
            className={`${size} ${
              isActive
                ? "fill-[#F4C400] text-[#F4C400]"
                : "fill-[#A9A9A9] text-[#A9A9A9]"
            }`}
          />
        );
      })}
    </div>
  );
}