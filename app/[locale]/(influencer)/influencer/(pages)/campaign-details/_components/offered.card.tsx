import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import React from "react";

interface OfferedCardProps {
  amount: number | string;
}

const OfferedCard = ({ amount }: OfferedCardProps) => {
  const t = useTranslations("influencer.campaign-details");
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const displayAmount = Number.isFinite(num) ? num.toLocaleString("en-US") : "0";

  return (
    <Card className="flex flex-1 flex-col justify-center rounded-lg border-light-gray p-4 shadow-md">
      <h2 className="font-semibold text-Primary">{t("Offered")}</h2>
      <h1 className="text-2xl font-semibold text-light-green md:w-3xl">
        ৳ {displayAmount}
      </h1>
    </Card>
  );
};

export default OfferedCard;
