"use client";
import React from "react";
import { AiFillTikTok } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa6";
import {
  RiFacebookFill,
  RiInstagramFill,
  RiLinkedinFill,
} from "react-icons/ri";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type AssignedInfluencer = {
  name: string;
  image?: string | null;
};

type CampaignSummaryHeaderProps = {
  label: string;
  title: string;
  platforms: string[];
  showPeopleSection: boolean;
  showInfluencerSection: boolean;
  assignedInfluencers: AssignedInfluencer[];
  assignedInfluencerNames: string[];
  agencyName: string | null;
  agencyLogo: string | null;
};

const platformIconMap: Record<string, React.ReactNode> = {
  instagram: <RiInstagramFill className="h-5 w-5" />,
  youtube: <FaYoutube className="h-5 w-5" />,
  tiktok: <AiFillTikTok className="h-5 w-5" />,
  facebook: <RiFacebookFill className="h-5 w-5" />,
  linkedin: <RiLinkedinFill className="h-5 w-5" />,
};

const IconPill = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/95 text-Primary shadow-sm">
    {children}
  </div>
);

const NamePill = ({ text }: { text: string }) => (
  <span className="inline-flex items-center rounded-full bg-[#F5F5DC] text-Primary px-3 py-1 text-sm font-medium">
    {text}
  </span>
);

const AvatarGroup = ({ items }: { items: AssignedInfluencer[] }) => {
  const displayItems = items.slice(0, 3);

  return (
    <div className="flex items-center gap-2">
      {displayItems.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className={`relative h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-white/70 ${
            index > 0 ? "" : ""
          }`}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-Primary">
              {item.name.trim().charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function CampaignSummaryHeader({
  label,
  title,
  platforms,
  showPeopleSection,
  showInfluencerSection,
  assignedInfluencers,
  assignedInfluencerNames,
  agencyName,
  agencyLogo,
}: CampaignSummaryHeaderProps) {
  const router = useRouter();
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex min-w-0 items-center gap-2 text-sm font-medium text-white cursor-pointer"
          onClick={() => router.back()}
        >
          <span className="rounded-full border border-white p-0.5">
            <ChevronLeft className="h-4 w-4 shrink-0" />
          </span>
          <span className="truncate">{label}</span>
        </div>
      </div>

      <h2 className="mt-3 text-xl font-semibold leading-snug text-white">
        {title}
      </h2>

      {showPeopleSection ? (
        <>
          <div className="mt-4">
            <div className="mb-3">
              {showInfluencerSection ? (
                <AvatarGroup items={assignedInfluencers} />
              ) : agencyLogo ? (
                <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-white">
                  <Image
                    src={agencyLogo}
                    alt={agencyName ?? "Agency"}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white/70 text-[11px] font-semibold text-Primary">
                  {(agencyName ?? "A").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
              <span className="text-sm font-medium text-white">
                {showInfluencerSection ? "Influencers:" : "Agency:"}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {showInfluencerSection ? (
                  assignedInfluencerNames.map((name) => (
                    <NamePill key={name} text={name} />
                  ))
                ) : agencyName ? (
                  <NamePill text={agencyName} />
                ) : null}
              </div>
            </div>

            <div className="mt-3 h-px w-full max-w-[460px] bg-white/70" />
          </div>
        </>
      ) : (
        <div className="mt-4 h-px w-full max-w-[460px] bg-white/70" />
      )}

      <div className="mt-5 flex items-center gap-4">
        <span className="shrink-0 text-sm font-medium text-white">
          Platforms
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {platforms.map((platform) => (
            <IconPill key={platform}>
              {platformIconMap[platform] ?? (
                <span className="text-[10px] font-semibold uppercase">
                  {platform.slice(0, 2)}
                </span>
              )}
            </IconPill>
          ))}
        </div>
      </div>
    </div>
  );
}
