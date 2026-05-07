"use client";

import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { InfluencerOption } from "./campaign-milestones-overview";

type Props = {
  influencerOptions: InfluencerOption[];
  selectedInfluencer: InfluencerOption | null;
  selectedInfluencerId: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (influencerId: string) => void;
};

export default function InfluencerSelector({
  influencerOptions,
  selectedInfluencer,
  selectedInfluencerId,
  isOpen,
  onToggle,
  onSelect,
}: Props) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-11 w-full items-center justify-between rounded-2xl border border-black/10 bg-white px-4 text-sm text-Primary"
      >
        <div className="flex min-w-0 items-center gap-3">
          {selectedInfluencer?.image ? (
            <div className="relative h-7 w-7 overflow-hidden rounded-full">
              <Image
                src={selectedInfluencer.image}
                alt={selectedInfluencer.name}
                fill
                className="object-cover"
                sizes="28px"
              />
            </div>
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F0D8] text-xs font-semibold text-Primary">
              {(selectedInfluencer?.name ?? "I").charAt(0).toUpperCase()}
            </span>
          )}

          <span className="truncate">
            {selectedInfluencer?.name ?? "Select Influencer"}
          </span>
        </div>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-black/70 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="absolute top-[calc(100%+8px)] z-20 w-full rounded-2xl border border-black/10 bg-white p-2 shadow-lg">
          <div className="max-h-64 overflow-y-auto">
            {influencerOptions.map((influencer) => {
              const isSelected = influencer.id === selectedInfluencerId;
              const isDisabled = Boolean(influencer.disabled);

              return (
                <button
                  key={influencer.id}
                  type="button"
                  onClick={() => {
                    if (isDisabled) return;
                    onSelect(influencer.id);
                  }}
                  disabled={isDisabled}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                    isDisabled
                      ? "cursor-not-allowed bg-gray-50 opacity-50"
                      : isSelected
                        ? "bg-orange/10"
                        : "hover:bg-black/5"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {influencer.image ? (
                      <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <Image
                          src={influencer.image}
                          alt={influencer.name}
                          fill
                          className={`object-cover ${isDisabled ? "grayscale-[35%]" : ""}`}
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F0D8] text-xs font-semibold text-Primary">
                        {influencer.name.charAt(0).toUpperCase()}
                      </span>
                    )}

                    <div className="min-w-0">
                      <span className="block truncate text-sm font-medium text-Primary">
                        {influencer.name}
                      </span>
                      {isDisabled ? (
                        <span className="text-[11px] font-medium text-gray-500">
                          Declined
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {isSelected ? (
                    <Check className="h-4 w-4 text-orange" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
