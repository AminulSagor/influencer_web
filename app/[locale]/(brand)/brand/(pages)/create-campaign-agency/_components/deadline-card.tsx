import { useFormStore } from "@/app/[locale]/(brand)/brand/zustand-store/campaign-forms-store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import React from "react";

const DeadlineCard = () => {
  const stepThree = useFormStore((s) => s.stepThree);
  return (
    <Card className="border-none bg-linear-to-r form-Primary to-light-green text-white bg-Primary">
      <CardHeader>
        <p className="flex gap-2 items-center">
          <Clock size={14} className="" />
          <span className="font-semibold">Deadline</span>
        </p>
      </CardHeader>
      <CardContent>
        <h1 className="text-3xl font-bold t">
          {stepThree.startingDate || "Not Selected"}
        </h1>
      </CardContent>
      <CardFooter>
        <p className="text-sm">
          Duration: {stepThree.duration || "not selected"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default DeadlineCard;
