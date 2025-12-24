import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import React from "react";

const OfferedCard = () => {
  const t = useTranslations("influencer.campaign-details");
  return (
    <Card className=" border-light-gray rounded-lg p-4 shadow-md">
      <h2 className="text-Primary font-semibold ">{t("Offered")}</h2>
      <h1 className="text-light-green text-2xl md:w-3xl font-semibold">
        ৳ 11,000
      </h1>
    </Card>
  );
};

export default OfferedCard;
