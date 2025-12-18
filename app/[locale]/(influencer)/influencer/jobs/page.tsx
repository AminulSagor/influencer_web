"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonLinks from "./_components/button-links";
import NewOfferSearch from "./_components/new-offer-search";
import NewOfferList from "./_components/new-offer-list";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("influencer.jobs.jobMarketplace"); // ✅

  return (
    <div className="p-4">
      <Card>
        {/* Header */}
        <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-Primary">
              {t("title")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>

          {/* Button links */}
          <div className="w-full sm:w-auto">
            <ButtonLinks />
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-4 space-y-8">
          <NewOfferSearch />
          <NewOfferList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
