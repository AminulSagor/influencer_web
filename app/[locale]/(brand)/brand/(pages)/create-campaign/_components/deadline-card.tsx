import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import React from "react";

const DeadlineCard = () => {
  return (
    <Card className="border-none bg-linear-to-r form-Primary to-light-green text-white bg-Primary">
      <CardHeader>
        <p className="flex gap-2 items-center">
          <Clock size={14} className="" />
          <span className="font-semibold">Deadline</span>
        </p>
      </CardHeader>
      <CardContent>
        <h1 className="text-3xl font-bold t">Dec 15, 2025</h1>
      </CardContent>
      <CardFooter>
        <p className="text-sm">Duration: 14 Days</p>
      </CardFooter>
    </Card>
  );
};

export default DeadlineCard;
