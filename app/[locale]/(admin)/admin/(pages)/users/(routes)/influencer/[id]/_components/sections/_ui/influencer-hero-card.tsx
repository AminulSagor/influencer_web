"use client";

import Image from "next/image";
import { Instagram, Youtube, Music2, HelpCircle } from "lucide-react";
import type { InfluencerSocialLink } from "@/types/admin/user/influencer-verification-profile_type";
import { extractUrlHandle } from "@/utils/admin/users/extract_url_handle_util";

type Props = {
  name: string;
  location: string;
  profileImage: string | null;
  isVerified?: boolean;
  socialLinks: InfluencerSocialLink[];
};

function iconFor(platform: string) {
  const p = String(platform ?? "").toLowerCase();
  if (p.includes("instagram")) return <Instagram className="h-5 w-5 text-Primary" />;
  if (p.includes("youtube")) return <Youtube className="h-5 w-5 text-Primary" />;
  if (p.includes("tiktok")) return <Music2 className="h-5 w-5 text-Primary" />;
  return <div className="h-5 w-5 rounded bg-Primary/20" />;
}

export default function InfluencerHeroCard({
  name,
  location,
  profileImage,
  isVerified,
  socialLinks,
}: Props) {
  return (
    <div
      className={[
        "rounded-[15px] border border-Primary/15",
        "bg-gradient-to-r from-Primary/80 to-Primary",
        "p-8 text-white",
        "min-h-[230px]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-8">
        {/* LEFT: avatar + name */}
        <div className="flex items-center gap-8 min-w-0">
          {/* Avatar (big) */}
          <div className="shrink-0">
            <div className="relative h-[140px] w-[140px] overflow-hidden rounded-full bg-white">
              {profileImage ? (
                <Image src={profileImage} alt={name} fill className="object-cover" />
              ) : null}
              {/* outer ring look */}
              <div className="pointer-events-none absolute inset-0 rounded-full ring-[3px] ring-white/70" />
            </div>
          </div>

          {/* Name + location + badge */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[28px] font-semibold leading-none whitespace-nowrap truncate">
                {name || "—"}
              </h2>

              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-Primary">
                <HelpCircle className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-2 text-[16px] text-white/75 whitespace-nowrap truncate">
              {location || ""}
            </div>

            {/* Cream badge like figma */}
            <span className="mt-4 inline-flex rounded-md bg-white-two px-5 py-1 text-sm font-medium text-Primary">
              {isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        {/* RIGHT: socials + logout */}
        <div className="w-[250px] shrink-0">
          <div className="space-y-4">
            {(socialLinks ?? []).slice(0, 3).map((s, idx) => (
              <div key={`${s.platform}-${idx}`} className="flex items-center gap-4">
                {/* icon box (cream) */}
                <div className="grid h-9 w-9 place-items-center rounded-md bg-white-two">
                  {iconFor(s.platform)}
                </div>

                <div className="text-[16px] text-white/90 whitespace-nowrap truncate">
                  @{extractUrlHandle(s.url)}
                </div>
              </div>
            ))}
          </div>

          {/* Logout (cream button, wide) */}
          <button
            type="button"
            className={[
              "mt-8 h-11 w-[190px]",
              "rounded-md bg-white-two text-Primary",
              "text-sm font-semibold",
              "border border-Primary/20",
              "hover:brightness-95 active:scale-[0.98]",
            ].join(" ")}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}