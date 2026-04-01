import { Agency } from "@/types/campaign/step2_campaign_type";
import { X } from "lucide-react";

type SelectedAgenciesTagsProps = {
  agencies: Agency[];
  onRemove: (agencyId: string) => void;
};

const SelectedAgenciesTags = ({
  agencies,
  onRemove,
}: SelectedAgenciesTagsProps) => {
  if (agencies.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {agencies.map((agency) => (
        <span
          key={agency.id}
          className="flex items-center gap-1 rounded-full bg-Secondary px-3 py-1 text-sm text-Primary"
        >
          {agency.name}
          <button type="button" onClick={() => onRemove(agency.id)}>
            <X className="h-3.5 w-3.5 cursor-pointer" />
          </button>
        </span>
      ))}
    </div>
  );
};

export default SelectedAgenciesTags;
