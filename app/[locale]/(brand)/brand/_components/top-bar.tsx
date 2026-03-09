"use client";

import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Notification from "@/app/[locale]/(brand)/brand/_components/notification";
import { BrandProfile } from "@/types/client/profile/profile";
import { getProfile } from "@/service/client/profile/profile";

export default function TopBar() {
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const result = await getProfile();

      if (!isMounted) return;

      if (typeof result === "string") {
        setError(result);
        setProfile(null);
        return;
      }

      setProfile(result);
      setError(null);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const brandName = profile?.brandName || "StyleCo.";
  const profileImg = profile?.profileImg || "";
  const fallbackText = brandName.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center justify-between border-b bg-white pl-2 pr-6 py-2.5">
      <div className="flex items-center justify-center gap-4">
        <div>
          <SidebarTrigger />
        </div>
        <div className="hidden md:block">
          <h1 className="text-Primary font-semibold">BrandGuru</h1>
          <h2 className="text-light-gray text-sm">Dashboard</h2>
        </div>
      </div>

      <div className="flex gap-6 items-center">
        <Notification />

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profileImg} alt={brandName} />
            <AvatarFallback>{fallbackText}</AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-semibold">{brandName}</h2>
            <p className="text-xs font-medium text-muted-foreground ml-1">
              {error ? error : "Client"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
