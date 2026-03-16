import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import React from "react";

interface OfferedCardProps {
  amount: number | string;
}

const OfferedCard = ({ amount }: OfferedCardProps) => {
  const t = useTranslations("influencer.campaign-details");
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return (
    <Card className=" border-light-gray rounded-lg p-4 shadow-md">
      <h2 className="text-Primary font-semibold ">{t("Offered")}</h2>
      <h1 className="text-light-green text-2xl md:w-3xl font-semibold">
        ৳ {num.toLocaleString("en-US")}
      </h1>
    </Card>
  );
};

export default OfferedCard;
