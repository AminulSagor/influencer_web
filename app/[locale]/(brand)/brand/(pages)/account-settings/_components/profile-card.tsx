"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getProfile } from "@/service/client/profile/profile";
import { BrandProfile } from "@/types/client/profile/profile";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileCard = () => {
  const t = useTranslations("brand.profile");
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

  const fullName =
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
    "Brand user";

  const brandName = profile?.brandName || "Brand";
  const profileImg = profile?.profileImg || "";
  const isVerified = profile?.isVerified ?? false;

  return (
    <Card className="w-full border-none bg-linear-to-r from-Primary/90 to-light-green">
      <CardContent>
        <div>
          <div className="flex items-center gap-4 lg:gap-10">
            <Avatar className="h-28 w-28">
              <AvatarImage src={profileImg} alt={fullName} />
              <AvatarFallback className="text-lg font-semibold">
                {fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-white/90">
              <h1 className="text-lg font-semibold">{fullName}</h1>
              <h2 className="text-sm">{brandName}</h2>
              <button className="mt-4 cursor-pointer rounded-md bg-Secondary px-6 py-1 text-xs text-Primary">
                {isVerified ? t("verified") : t("unverified")}
              </button>
              {error && <p className="mt-2 text-xs text-white/80">{error}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="cursor-pointer rounded-md bg-Secondary px-6 py-1 text-sm text-Primary">
              {t("logout")}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;