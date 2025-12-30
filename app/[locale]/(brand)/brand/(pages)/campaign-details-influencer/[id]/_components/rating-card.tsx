'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type RatingCardProps = {
  title?: string;
  value?: number; // 0-5
  onChange?: (v: number) => void;
  onSubmit?: () => void;
  buttonText?: string;
  disabled?: boolean;
};

const RatingCard = ({
  title = "Rate The Influencers",
  value = 0,
  onChange,
  onSubmit,
  buttonText = "Provide Ratings To Influencers",
  disabled = false,
}: RatingCardProps) => {
  return (
    <Card className="rounded-2xl bg-white shadow-sm p-0">
      <CardContent className="p-6">
        <h3 className="font-semibold text-Primary">{title}</h3>

        <div className="mt-8 flex flex-col items-center justify-center gap-6">
          {/* Stars */}
          <div className="flex items-center gap-4">
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1;
              const active = starValue <= value;

              return (
                <button
                  key={starValue}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange?.(starValue)}
                  className="disabled:cursor-not-allowed"
                  aria-label={`Rate ${starValue} star${
                    starValue > 1 ? "s" : ""
                  }`}
                >
                  <Star
                    className={`h-10 w-10 ${
                      active
                        ? "fill-Primary text-Primary"
                        : "fill-gray-400 text-gray-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Button */}
          <Button
            type="button"
            disabled={disabled}
            onClick={onSubmit}
            className="h-10 w-[320px] rounded-md bg-gray-400 text-white hover:bg-gray-400/90 disabled:opacity-100"
          >
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingCard;
