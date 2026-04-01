import clsx from "clsx";
import { Card, CardContent } from "@/components/ui/card";
import { Agency } from "@/types/campaign/step2_campaign_type";

type AgencyHorizontalCardProps = {
  agency: Agency;
  onClick: () => void;
};

const AgencyHorizontalCard = ({
  agency,
  onClick,
}: AgencyHorizontalCardProps) => {
  return (
    <Card
      className={clsx(
        "w-[210px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border-none",
        "bg-linear-to-r from-Primary to-light-green",
      )}
      onClick={onClick}
    >
      <CardContent className="flex h-full flex-col items-center justify-center">
        <div className="h-18 w-18 rounded-full bg-linear-to-br from-white/70 to-light-green/40 shadow-inner" />

        <div className="mt-4 text-center">
          <p className="text-lg font-semibold leading-tight text-white">
            {agency.name}
          </p>
          <p className="text-sm text-white/80">{agency.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgencyHorizontalCard;
