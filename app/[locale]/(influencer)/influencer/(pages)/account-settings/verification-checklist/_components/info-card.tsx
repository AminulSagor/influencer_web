"use client";

import { Music, AlertCircle } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import LogoutConfirmButton from "@/components/logout-confirm-button";
import { InfluencerProfileData } from "@/types/influencer/account_setting/profile_type";

type InfoCardProps = {
  status: boolean;
  profile: InfluencerProfileData | null;
};

export default function InfoCard({ status, profile }: InfoCardProps) {
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Influencer";

  const defaultAddress = profile?.addresses?.[0];

  const location = [
    defaultAddress?.zilla,
    defaultAddress?.country || "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");

  const instagram = profile?.socialLinks?.find(
    (item) => item.platform?.trim().toLowerCase() === "instagram",
  );

  const youtube = profile?.socialLinks?.find(
    (item) => item.platform?.trim().toLowerCase() === "youtube",
  );

  const tiktok = profile?.socialLinks?.find(
    (item) => item.platform?.trim().toLowerCase() === "tiktok",
  );

  return (
    <div className="flex rounded-2xl bg-linear-to-r from-Primary to-light-green p-4 text-white">
      <div className="flex w-full flex-col items-center justify-between gap-6 px-3 sm:flex-row md:px-4 xl:px-8">
        <div className="flex w-full items-center gap-4 sm:w-auto">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white/70 bg-white">
            <img
              src={profile?.profileImg || "/avatar/avatar.png"}
              alt="profile image"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold leading-none">{fullName}</h3>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/90 text-[10px] text-[#5E7F3A]">
                <AlertCircle className="h-3 w-3" />
              </span>
            </div>

            <p className="text-sm text-[#DDE8C6]">{location || "Bangladesh"}</p>

            <span className="mt-1 inline-block rounded-md bg-[#F1F6DE] px-3 py-0.5 text-xs text-[#2D5016]">
              {status ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 sm:w-[260px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 break-all">
              <FaInstagram size={26} />
              <span>{instagram?.url || fullName}</span>
            </div>

            <div className="flex items-center gap-2 break-all">
              <FaYoutube size={26} />
              <span>{youtube?.url || fullName}</span>
            </div>

            <div className="flex items-center gap-2 break-all">
              <Music size={26} />
              <span>{tiktok?.url || fullName}</span>
            </div>
          </div>

          <LogoutConfirmButton
            className="rounded-lg bg-[#F1F6DE] px-6 py-1.5 text-sm font-medium text-[#2D5016] hover:opacity-90 disabled:opacity-50 sm:max-w-44"
            loadingChildren="Logging out..."
          >
            Log Out
          </LogoutConfirmButton>
        </div>
      </div>
    </div>
  );
}
