import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const ProfileCard = () => {
  return (
    <Card className="bg-linear-to-r from-Primary/90 to-light-green border-none w-full">
      <CardContent>
        <div>
          <div className="flex items-center gap-4 lg:gap-10">
            <div className="h-28 w-28 rounded-full bg-white" />
            <div className="text-white/90">
              <h1 className="text-lg font-semibold">Salman Khan</h1>
              <h2 className="text-sm">StleCo.</h2>
              <button className="mt-4 bg-Secondary px-6 py-1 rounded-md text-Primary text-xs cursor-pointer">
                Unverified
              </button>
            </div>
          </div>

          {/* logout button */}
          <div className="flex justify-end">
            <button className="bg-Secondary px-6 py-1 rounded-md text-Primary text-sm cursor-pointer">
              Log Out
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
