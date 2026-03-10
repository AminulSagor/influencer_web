"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  brandName: string;
  firstName: string;
  lastName: string;
  country: string;
  thana: string;
  zilla: string;
  fullAddress: string;
  email: string;
  phone: string;
};

const ProfileBasicInfoSection = ({
  brandName,
  firstName,
  lastName,
  country,
  thana,
  zilla,
  fullAddress,
  email,
  phone,
}: Props) => {
  const t = useTranslations("brand.profile");
  const fullName = `${firstName} ${lastName}`.trim();
  const locationText = [thana, zilla].filter(Boolean).join(", ");

  return (
    <div className="flex-1">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-Primary">
          {brandName || "-"}
        </h2>
        <p className="font-medium leading-none text-Primary">{fullName || "-"}</p>
        <p className="text-xs leading-none text-Primary/60">
          {t("basicInfo.role")}
        </p>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-light-green/15">
            <MapPin className="h-4 w-4 text-light-green" />
          </span>
          <div>
            <p className="font-medium text-light-green">{country || "-"}</p>
            <p className="text-xs text-Primary/50">
              {locationText || fullAddress || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-light-green/15">
            <Mail className="h-4 w-4 text-light-green" />
          </span>
          <p className="text-sm text-Primary/70">{email || "-"}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-light-green/15">
            <Phone className="h-4 w-4 text-light-green" />
          </span>
          <p className="text-sm text-Primary/70">{phone || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileBasicInfoSection;