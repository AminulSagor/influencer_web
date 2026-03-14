import clsx from "clsx";
import { Card, CardContent } from "@/components/ui/card";
import { Agency } from "@/types/campaign/step2_campaign_type";

type AgencyVerticalCardProps = {
  agency: Agency;
  onClick: () => void;
};

const AgencyVerticalCard = ({ agency, onClick }: AgencyVerticalCardProps) => {
  return (
    <Card
      className={clsx(
        "w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl border-none",
        "bg-linear-to-r from-Primary to-light-green",
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4">
        <div className="h-15 w-15 rounded-full bg-linear-to-br from-white/70 to-light-green/40 shadow-inner" />

        <div className="text-center">
          <p className="text-lg font-semibold leading-tight text-white">
            {agency.name}
          </p>
          <p className="text-sm text-white/80">{agency.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgencyVerticalCard;
