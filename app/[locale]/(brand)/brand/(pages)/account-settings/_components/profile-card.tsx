"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileStore } from "@/store/client-profile-store";
import Loader from "@/components/spin-loader";
import { useLogout } from "@/hooks/useLogout";

const ProfileCard = () => {
  const t = useTranslations("brand.profile");
  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const { logout } = useLogout();
  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const fullName =
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
    "Brand user";

  const brandName = profile?.brandName || "Brand";
  const profileImg = profile?.profileImg || "";
  const isVerified = profile?.isVerified ?? false;

  return (
    <Card className="w-full border-none bg-linear-to-r from-Primary/90 to-light-green">
      <CardContent>
        {isLoading && !profile ? (
          <div className="flex min-h-[140px] items-center justify-center">
            <Loader className="h-8 w-8 border-white border-t-transparent" />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 lg:gap-10">
              <Avatar className="h-28 w-28">
                <AvatarImage
                  src={profile?.profileImg || undefined}
                  alt={fullName}
                />
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
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="cursor-pointer rounded-md bg-Secondary px-6 py-1 text-sm text-Primary"
                onClick={() => logout()}
              >
                {t("logout")}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
