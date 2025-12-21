"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

type DashboardCard = {
  title: string;
  value: string;
  icon: LucideIcon | IconType;
  onViewAll?: () => void;
};

export default function DashboardStatsCards({
  cards,
  viewAllLabel,
}: {
  cards: DashboardCard[];
  viewAllLabel: string;
}) {
  return (
    <div className="pt-4 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(({ icon: Icon, title, value, onViewAll }, index) => (
          <div
            key={index}
            className="bg-linear-to-r from-[#405E2C]/90 to-[#7A9B57] rounded-lg p-5 space-y-8 shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-white">{title}</p>
              <Icon size={30} className="text-white" />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-white font-bold text-2xl">{value}</p>

              <Button
                variant="link"
                className="text-white p-0"
                onClick={onViewAll}
                type="button"
              >
                {viewAllLabel} <ChevronRight />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
