"use client";

import { useTranslations } from "next-intl";

export default function ExploreHeader() {
  const t = useTranslations("brand.explore");

  return (
    <div>
      <h1 className="text-lg font-semibold text-Primary">{t("title")}</h1>
      <p className="text-sm text-dark-gray">{t("description")}</p>
    </div>
  );
}
