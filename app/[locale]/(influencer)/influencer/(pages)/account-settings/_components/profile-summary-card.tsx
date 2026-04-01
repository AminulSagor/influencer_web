"use client";

import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { InfluencerProfileData } from "@/types/influencer/account_setting/profile_type";
import { getPlatformIcon } from "@/utils/platforms_util";
import { useLogout } from "@/hooks/useLogout";
import Image from "next/image";

interface ProfileSummaryCardProps {
  profileData: InfluencerProfileData | null;
  loading: boolean;
}

export default function ProfileSummaryCard({ profileData, loading }: ProfileSummaryCardProps) {
  const t = useTranslations('influencer.account-setting');
  const { logout, loading: logoutLoading } = useLogout();
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return (
      <div className="rounded-2xl bg-linear-to-r from-Primary to-light-green text-white flex items-center justify-center p-4 h-50">
        <p className="text-white/80">Loading profile...</p>
      </div>
    );
  }

  const fullName = `${profileData?.firstName || ""} ${profileData?.lastName || ""}`.trim() || "User";
  const location = profileData?.addresses?.[0] 
    ? `${profileData.addresses[0].zilla}, ${profileData.addresses[0].country}`
    : "Location not set";
  const verificationStatus = profileData?.isVerified ? "Verified" : "Unverified";
  const topSocialLinks = profileData?.socialLinks?.slice(0, 3) || [];

  return (
    <div className="rounded-2xl bg-linear-to-r from-Primary to-light-green text-white flex sm:items-center sm:justify-center p-4 ">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between xl:px-4 w-full xl:max-w-xl px-3 md:px-4 overflow-y-scroll no-scrollbar">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-4 w-full">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-white/70 overflow-hidden relative">
            {profileData?.profileImg && !imageError ? (
              <Image 
                src={profileData.profileImg} 
                alt={fullName}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/20 text-2xl font-semibold">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold leading-none">{fullName}</h3>
              {!profileData?.isVerified && (
                <span className="w-4 h-4 rounded-full bg-white/90 text-[#5E7F3A] text-[10px] flex items-center justify-center">
                  <AlertCircle className="w-3 h-3" />
                </span>
              )}
            </div>

            <p className="text-sm text-[#DDE8C6]">{location}</p>

            <span className={`inline-block mt-1 px-3 py-0.5 text-xs rounded-md ${
              profileData?.isVerified 
                ? "bg-green-100 text-green-800" 
                : "bg-[#F1F6DE] text-[#2D5016]"
            }`}>
              {verificationStatus}
            </span>
          </div>
        </div>

        {/* Right: Socials + Logout */}
        <div className="flex flex-col gap-4 w-full pl-3 sm:pl-0">
          {/* Social handles */}
          <div className="space-y-2">
            {topSocialLinks.length > 0 ? (
              topSocialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <span>
                    {getPlatformIcon(link.platform, "h-6 w-6")}
                  </span>
                  <span className="truncate max-w-37.5">
                    {link.url.replace(/https?:\/\/(www\.)?/, '').split('/')[0]}
                  </span>
                </a>
              ))
            ) : (
              <p className="text-sm text-[#DDE8C6]">No social links added</p>
            )}
          </div>

          {/* Logout */}
          <button 
            onClick={logout}
            disabled={logoutLoading}
            className="px-6 py-1.5 rounded-lg bg-[#F1F6DE] text-[#2D5016] text-sm font-medium hover:opacity-90 gap-2 sm:max-w-44 disabled:opacity-50"
          >
            {logoutLoading ? "Logging out..." : t("Log Out")}
          </button>
        </div>
      </div>
    </div>
  );
}
