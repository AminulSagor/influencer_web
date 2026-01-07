"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, HelpCircle, Headphones } from "lucide-react";

const NeedHelpCard = () => {
  return (
    <Card className="py-0 relative bg-white">
      <CardContent className="py-5">
        <h1 className="font-semibold text-base text-Primary mb-4">Need Help?</h1>

        <div className="grid md:grid-cols-2 gap-4">
          <HelpRow icon={<HelpCircle className="w-5 h-5 text-light-green" />} title="Verification Guide" />
          <HelpRow icon={<Headphones className="w-5 h-5 text-light-green" />} title="Contact Support" />
        </div>
      </CardContent>
    </Card>
  );
};

export default NeedHelpCard;

function HelpRow({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-between border rounded-xl px-5 py-4 hover:bg-light-green/5 transition"
    >
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-sm font-medium text-Primary">{title}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-Primary/40" />
    </button>
  );
}
