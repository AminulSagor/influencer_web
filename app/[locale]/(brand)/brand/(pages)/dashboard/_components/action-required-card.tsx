"use client";

import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ActionRequiredItem } from "@/types/client/dashboard/dashboard-types";
import { useState } from "react";

type Props = {
  data?: ActionRequiredItem[];
};

const ITEMS_PER_PAGE = 2;

const ActionRequiredCard = ({ data = [] }: Props) => {
  const t = useTranslations("brand.dashboard.actionRequired");
  const [page, setPage] = useState(0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#2d5016]">{t("title")}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-500 text-center py-6">
            {t("noActionRequired")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const pages = [];
  for (let i = 0; i < data.length; i += ITEMS_PER_PAGE) {
    pages.push(data.slice(i, i + ITEMS_PER_PAGE));
  }

  const currentItems = pages[page] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">{t("title")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {currentItems.map((issue, index) => (
          <div
            key={`${issue.type}-${index}`}
            className="bg-[#FFF4EE] rounded-lg p-4 flex flex-row lg:flex-col xl:flex-row justify-between items-center lg:items-start xl:items-center gap-2"
          >
            <FaExclamationTriangle className="fill-amber-500" size={40} />

            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-semibold text-black">{issue.title}</h1>
                <p className="text-dark-gray text-sm">{issue.description}</p>
              </div>
            </div>

            <Link
              href="#"
              className="bg-[#F09A30] rounded-md px-6 py-1.5 text-white text-sm"
            >
              Fix
            </Link>
          </div>
        ))}

        {pages.length > 1 && (
          <div className="flex justify-center gap-2 pt-2">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === page ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionRequiredCard;
