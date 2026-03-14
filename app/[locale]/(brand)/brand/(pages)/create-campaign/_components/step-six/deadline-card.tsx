import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { Campaignservice } from "@/types/client/campaigns/create-campaign-types";

type Props = { campaign: Campaignservice | null };

const DeadlineCard = ({ campaign }: Props) => {
  return (
    <Card className="border-none bg-linear-to-r form-Primary to-light-green text-white bg-Primary">
      <CardHeader>
        <p className="flex gap-2 items-center">
          <Clock size={14} />
          <span className="font-semibold">Deadline</span>
        </p>
      </CardHeader>

      <CardContent>
        <h1 className="text-3xl font-bold t">
          {campaign?.startingDate || "Not Selected"}
        </h1>
      </CardContent>

      <CardFooter>
        <p className="text-sm">
          Duration: {campaign?.duration ?? "not selected"} days
        </p>
      </CardFooter>
    </Card>
  );
};

export default DeadlineCard;
