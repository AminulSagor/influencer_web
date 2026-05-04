"use client";

import { useEffect } from "react";
import { Globe, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/store/client-profile-store";
import Loader from "@/components/spin-loader";

const formatWebsiteUrl = (url?: string | null) => {
  const trimmedUrl = url?.trim();
  if (!trimmedUrl) return "";

  return /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;
};

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

  const websiteUrl = formatWebsiteUrl(profile?.website);

  const contactInfos = [
    {
      key: "email",
      label: t("information.email"),
      value: profile?.email || "-",
      icon: Mail,
      href: profile?.email ? `mailto:${profile.email}` : "",
    },
    {
      key: "contact",
      label: t("information.contact"),
      value: profile?.phone || profile?.primaryPhone || "-",
      icon: Phone,
      href: profile?.phone ? `tel:${profile.phone}` : "",
    },
    {
      key: "website",
      label: t("information.website"),
      value: profile?.website || "-",
      icon: Globe,
      href: websiteUrl,
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
            {contactInfos.map((info) => {
              const Icon = info.icon;
              const content = (
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-light-gray text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 text-xs">
                    <h2 className="text-light-green">{info.label}</h2>
                    <p className="truncate">{info.value}</p>
                  </div>
                </div>
              );

              return info.href ? (
                <a
                  key={info.key}
                  href={info.href}
                  target={info.key === "website" ? "_blank" : undefined}
                  rel={
                    info.key === "website" ? "noreferrer noopener" : undefined
                  }
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <div key={info.key}>{content}</div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InformationCard;
