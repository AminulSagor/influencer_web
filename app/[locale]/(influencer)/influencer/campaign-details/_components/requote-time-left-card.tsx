import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import { IoIosHourglass } from "react-icons/io";

const RequoteTimeLeftCard = () => {
  return (
    <Card className="gap-2 h-full justify-between">
      <CardHeader>
        <div className="flex justify-center">
          <IoIosHourglass size={60} className="text-orange" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <p className="text-orange text-4xl font-semibold">12 H : 30 M</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-Primary text-center">
            Left to Requote
          </p>
          <p className="text-gray-500  text-center mx-auto text-xs">
            Request to requote within 12 Dec, 2025, 12:00pm
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RequoteTimeLeftCard;
