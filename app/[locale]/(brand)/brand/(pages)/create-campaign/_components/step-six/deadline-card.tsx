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
    <Card className="flex h-full min-h-[190px] flex-col border-none bg-linear-to-r from-Primary to-light-green text-white">
      <CardHeader className="pb-2">
        <p className="flex items-center gap-2 text-base font-semibold">
          <Clock size={16} />
          <span>Deadline</span>
        </p>
      </CardHeader>

      <CardContent className="flex-1 py-2">
        <h1 className="text-3xl font-bold leading-tight">
          {campaign?.startingDate || "Not Selected"}
        </h1>
      </CardContent>

      <CardFooter className="mt-auto pt-2">
        <p className="text-sm">
          Duration: {campaign?.duration ?? "not selected"} days
        </p>
      </CardFooter>
    </Card>
  );
};

export default DeadlineCard;
