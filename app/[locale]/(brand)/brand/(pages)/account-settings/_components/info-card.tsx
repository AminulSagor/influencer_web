"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/store/client-profile-store";
import Loader from "@/components/spin-loader";

const InformationCard = () => {
  const t = useTranslations("brand.profile");
  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const contactInfos = [
    {
      key: "email",
      label: t("information.email"),
      value: profile?.email || "-",
    },
    {
      key: "contact",
      label: t("information.contact"),
      value: profile?.phone || "-",
    },
    {
      key: "website",
      label: t("information.website"),
      value: profile?.website || "-",
    },
  ];

  return (
    <Card className="w-full">
      <CardContent>
        {isLoading && !profile ? (
          <div className="flex min-h-[140px] items-center justify-center">
            <Loader className="h-8 w-8 border-light-green border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {contactInfos.map((info) => (
              <div key={info.key} className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-light-gray" />
                <div className="text-xs">
                  <h2 className="text-light-green">{info.label}</h2>
                  <p>{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InformationCard;
