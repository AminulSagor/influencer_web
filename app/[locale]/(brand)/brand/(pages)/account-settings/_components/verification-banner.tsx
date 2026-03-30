"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle } from "lucide-react";

type Props = {
  isVerified: boolean;
};

const VerificationBanner = ({ isVerified }: Props) => {
  const t = useTranslations("brand.profile");

  return isVerified ? (
    <div className="flex w-full items-center gap-3 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <p className="text-sm font-medium text-green-600">
        {t("verification.banner.verified")}
      </p>
    </div>
  ) : (
    <div className="flex w-full items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
      <XCircle className="h-4 w-4 text-red-500" />
      <p className="text-sm font-medium text-red-500">
        {t("verification.banner.unverified")}
      </p>
    </div>
  );
};

export default VerificationBanner;