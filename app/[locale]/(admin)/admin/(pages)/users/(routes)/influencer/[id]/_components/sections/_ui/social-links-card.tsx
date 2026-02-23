"use client";

import { Instagram, Youtube, Music2, Link2 } from "lucide-react";
import type { InfluencerSocialLink } from "@/types/admin/user/influencer-verification-profile_type";
import SectionHeader from "./section-header";
import ActionButtons from "./action-buttons";

function iconFor(platform: string) {
  const p = String(platform ?? "").toLowerCase();
  if (p.includes("instagram")) return <Instagram className="h-5 w-5" />;
  if (p.includes("youtube")) return <Youtube className="h-5 w-5" />;
  if (p.includes("tiktok")) return <Music2 className="h-5 w-5" />;
  return <Link2 className="h-5 w-5" />;
}

type Props = {
  socialLinks: InfluencerSocialLink[];
};

export default function SocialLinksCard({ socialLinks }: Props) {
  return (
    <div className="rounded-xl border border-primary/15 bg-white p-6">
      <SectionHeader title="Social Links" showNotify />

      <div className="mt-5 space-y-4">
        {(socialLinks ?? []).length === 0 ? (
          <div className="text-sm text-light-gray">No social links found.</div>
        ) : (
          socialLinks.map((s, idx) => (
            <div
              key={`${s.platform}-${idx}`}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-off-white text-black">
                  {iconFor(s.platform)}
                </div>

                <div>
                  <div className="text-sm font-semibold text-black">{s.platform}</div>
                  <div className="text-sm text-light-gray">{s.url}</div>
                </div>
              </div>

              <ActionButtons rightLabel="Accept" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}