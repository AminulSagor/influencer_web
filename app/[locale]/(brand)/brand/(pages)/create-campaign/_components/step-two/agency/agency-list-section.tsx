import { Agency } from "@/types/campaign/step2_campaign_type";
import AgencyHorizontalCard from "./agency-horizontal-card";
import AgencyVerticalCard from "./agency-vertical-card";

type AgencyListSectionProps = {
  title: string;
  agencies: Agency[];
  variant: "horizontal" | "vertical";
  onSelect: (agency: Agency) => void;
  onReachEnd?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
};

const AgencyListSection = ({
  title,
  agencies,
  variant,
  onSelect,
  onReachEnd,
  hasMore = false,
  isLoading = false,
}: AgencyListSectionProps) => {
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (variant !== "vertical" || !onReachEnd) return;

    const element = event.currentTarget;

    if (
      element.scrollTop + element.clientHeight >= element.scrollHeight - 20 &&
      hasMore &&
      !isLoading
    ) {
      onReachEnd();
    }
  };

  return (
    <div>
      <h1 className="font-semibold text-Primary">{title}</h1>

      {variant === "horizontal" ? (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {agencies.map((agency) => (
            <AgencyHorizontalCard
              key={agency.id}
              agency={agency}
              onClick={() => onSelect(agency)}
            />
          ))}
        </div>
      ) : (
        <div
          className="mt-3 flex max-h-72 flex-col gap-3 overflow-y-auto"
          onScroll={handleScroll}
        >
          {agencies.map((agency) => (
            <AgencyVerticalCard
              key={agency.id}
              agency={agency}
              onClick={() => onSelect(agency)}
            />
          ))}

          {isLoading && (
            <p className="py-2 text-center text-sm text-gray-500">Loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AgencyListSection;
