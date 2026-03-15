"use client";

import { useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Notification from "@/app/[locale]/(brand)/brand/_components/notification";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/spin-loader";
import { useProfileStore } from "@/store/client-profile-store";

export default function TopBar() {
  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    if (!profile && !isLoading) {
      fetchProfile();
    }
  }, [profile, isLoading, fetchProfile]);

  const brandName = profile?.brandName?.trim() || "StyleCo.";
  const profileImg = profile?.profileImg?.trim() || "";
  const fallbackText = brandName.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center justify-between border-b bg-white py-2.5 pl-2 pr-6">
      <div className="flex items-center justify-center gap-4">
        <div>
          <SidebarTrigger />
        </div>

        <div className="hidden md:block">
          <h1 className="font-semibold text-Primary">BrandGuru</h1>
          <h2 className="text-sm text-light-gray">Dashboard</h2>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Notification />

        <Link
          href="/brand/account-settings"
          className="flex items-center gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
            {isLoading ? (
              <Loader className="h-4 w-4 border-2" />
            ) : profileImg ? (
              // <Image
              //   src={profileImg}
              //   alt={brandName}
              //   width={32}
              //   height={32}
              //   className="h-full w-full object-cover"
              // />

              <img
                src={profileImg}
                alt={brandName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-Primary">
                {fallbackText}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{brandName}</h2>
            <p className="ml-1 text-xs font-medium text-muted-foreground">
              Client
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
