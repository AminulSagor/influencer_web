"use client";

import { IoMdCloseCircle } from "react-icons/io";
import { FaExclamationTriangle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const ActionRequiredCard = () => {
  const t = useTranslations("influencer.dashboard.actionRequired");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Card 1 */}
        <div className="bg-rose-50 px-2 py-4 rounded-md border border-rose-200 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <IoMdCloseCircle className="fill-rose-600" size={30} />
              <div>
                <h3 className="font-semibold text-sm">{t("card1Title")}</h3>
                <p className="text-rose-600 text-xs font-medium">
                  {t("card1Description")}
                </p>
                <span className="text-muted-foreground text-xs">
                  {t("card1Time")}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 cursor-pointer"
            >
              {t("card1Button")}
            </Button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-yellow-50 px-2 py-4 rounded-md border border-yellow-300 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="fill-yellow-600" size={30} />
              <div>
                <h3 className="font-semibold text-sm">{t("card2Title")}</h3>
                <span className="text-muted-foreground text-xs">
                  {t("card2Time")}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
            >
              {t("card2Button")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionRequiredCard;
