import { Card } from "@/components/ui/card";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const ProfileCompletionPercentCard = () => {
  return (
    <Card>
      <div className="px-4">
        <div className="space-y-4">
          <h2 className="text-Primary flex items-center gap-2 font-semibold">
            <FaCheckCircle />
            Profile Completion
          </h2>
          <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-light-green rounded-full transition-all duration-300"
              style={{ width: `${50}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCompletionPercentCard;
