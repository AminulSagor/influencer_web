import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import ButtonLinks from "../_components/button-links";

const page = () => {
  return (
    <div>
      <div className="p-4">
        <Card>
          <CardHeader className="flex justify-between items-center border-b">
            <div>
              <CardTitle className="text-lg font-bold text-Primary">
                Job Marketplace
              </CardTitle>
              <CardDescription>
                Browse and manage your job offers
              </CardDescription>
            </div>
            <div>
              <ButtonLinks />
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default page;
