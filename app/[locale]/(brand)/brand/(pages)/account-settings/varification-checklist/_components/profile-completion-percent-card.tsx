import { Card } from "@/components/ui/card";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface Props {
  percentage: number;
}

const ProfileCompletionPercentCard = ({ percentage }: Props) => {
  return (
    <Card className="py-4">
      <div className="px-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-Primary">
              <FaCheckCircle />
              Profile Completion
            </h2>
            <span className="text-sm font-medium text-Primary">
              {percentage}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-light-green/30">
            <div
              className="h-full rounded-full bg-light-green transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCompletionPercentCard;
