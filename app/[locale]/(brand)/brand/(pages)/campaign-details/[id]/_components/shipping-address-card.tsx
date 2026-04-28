"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";
import InfluencerSelector from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-overview/influencer-selector";

// Keep the same option shape used by the campaign milestone influencer dropdown.
type InfluencerOption = {
  id: string;
  name: string;
  image: string | null;
};

type ShippingAddressCardProps = {
  campaign: ClientCampaignDetails;
  selectedInfluencerId: string;
  onSelectInfluencer: (influencerId: string) => void;
  className?: string;
};

export default function ShippingAddressCard({
  campaign,
  selectedInfluencerId,
  onSelectInfluencer,
  className = "",
}: ShippingAddressCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const assignedInfluencers = React.useMemo(
    () => campaign.assignedInfluencers ?? [],
    [campaign.assignedInfluencers],
  );

  const influencerOptions = React.useMemo<InfluencerOption[]>(
    () =>
      assignedInfluencers.map((influencer) => ({
        id: influencer.influencerId,
        name: influencer.name,
        image: influencer.image ?? null,
      })),
    [assignedInfluencers],
  );

  const effectiveSelectedInfluencerId = React.useMemo(() => {
    if (
      selectedInfluencerId &&
      influencerOptions.some((option) => option.id === selectedInfluencerId)
    ) {
      return selectedInfluencerId;
    }

    return influencerOptions[0]?.id ?? "";
  }, [selectedInfluencerId, influencerOptions]);

  const selectedInfluencer = React.useMemo(
    () =>
      assignedInfluencers.find(
        (influencer) => influencer.influencerId === effectiveSelectedInfluencerId,
      ) ?? null,
    [assignedInfluencers, effectiveSelectedInfluencerId],
  );

  const selectedInfluencerOption = React.useMemo(
    () =>
      influencerOptions.find(
        (option) => option.id === effectiveSelectedInfluencerId,
      ) ?? null,
    [influencerOptions, effectiveSelectedInfluencerId],
  );

  React.useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (
    campaign.campaignType !== "influencer_promotion" ||
    assignedInfluencers.length === 0
  ) {
    return null;
  }

  const shippingAddress = selectedInfluencer?.location?.trim();

  const handleSelectInfluencer = (influencerId: string) => {
    onSelectInfluencer(influencerId);
    setIsDropdownOpen(false);
  };

  return (
    <Card className={`h-full min-h-[140px] rounded-[12px] border border-black/10 shadow-none ${className}`}>
      <CardContent className="flex h-full min-h-0 flex-col justify-center gap-2 p-4">
        <div className="flex items-center gap-2 text-Primary">
          <MapPin className="h-5 w-5 text-light-green" />
          <h3 className="text-base font-semibold">Shipping Address</h3>
        </div>

        <div ref={dropdownRef}>
          <InfluencerSelector
            influencerOptions={influencerOptions}
            selectedInfluencer={selectedInfluencerOption}
            selectedInfluencerId={effectiveSelectedInfluencerId}
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen((prev) => !prev)}
            onSelect={handleSelectInfluencer}
          />
        </div>

        <div className="flex min-h-9 items-center gap-3 rounded-[12px] border border-black/10 bg-white px-4 py-2 text-sm text-black/45">
          <MapPin className="h-4 w-4 shrink-0 text-light-green" />
          <p className="min-w-0 break-words">
            {shippingAddress || "No shipping address available"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
