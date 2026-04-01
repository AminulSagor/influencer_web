"use client";

import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

type Role = "client" | "agency" | "admin" | "influencer";

type Props = {
  role?: Role;
  isVerified?: boolean;
};

const LaunchBannerCard = ({ role, isVerified = false }: Props) => {
  const t = useTranslations("brand.unverified.launchBanner");

  const isAgency = role === "agency";

  const title = isVerified
    ? t("verifiedTitle")
    : isAgency
      ? t("agencyTitle")
      : t("defaultTitle");

  const description = isVerified
    ? t("verifiedDescription")
    : isAgency
      ? t("agencyDescription")
      : t("defaultDescription");

  return (
    <Card className="bg-linear-to-r from-Primary/90 to-light-green border-none">
      <CardContent>
        <div className="flex flex-col items-center text-center text-white">
          <Star className="w-6 h-6 mb-2" />

          <h2 className="text-lg font-semibold">{title}</h2>

          <p className="text-sm text-white/90 mt-1 leading-relaxed max-w-[320px]">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaunchBannerCard;
