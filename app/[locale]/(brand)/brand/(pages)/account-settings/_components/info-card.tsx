"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getProfile } from "@/service/client/profile/profile";
import { BrandProfile } from "@/types/client/profile/profile";
import { useTranslations } from "next-intl";

const InformationCard = () => {
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

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default InformationCard;