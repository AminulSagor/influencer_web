"use client";

import { useState } from "react";
import {
  ChevronUp,
  FileText,
  Target,
  Package,
  ClipboardList,
  CheckCircle2,
  XCircle,
  ScrollText,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function CampaignBriefSection() {
  const [open, setOpen] = useState(true);
  const t = useTranslations("influencer.campaign-details");

  return (
    <Card
      className={`relative rounded-2xl bg-white p-3 md:px-4 xl:px-6 ${
        open ? "pb-4" : "pb-0"
      }`}
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* ================= LEFT : CAMPAIGN BRIEF ================= */}
        <div
          className={`${
            open ? "md:border-r md:pr-6" : ""
          } border-b md:border-b-0 pb-6 md:pb-0`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-Primary font-semibold mb-4 pt-4 md:pt-0">
              <FileText className="w-5 h-5" />
              <span className="text-base md:text-lg">
                {t("Campaign Details")}
              </span>
            </div>
            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle Campaign Brief"
              className="cursor-pointer md:hidden"
            >
              <ChevronUp
                size={28}
                className={`text-Primary transition-transform duration-300 ${
                  open ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>
          </div>

          {/* COLLAPSIBLE CONTENT */}
          <div
            className={`space-y-5 transition-all duration-300 ease-in-out ${
              open
                ? "max-h-[2000px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <Section
              icon={Target}
              title={t("Campaign Goals")}
              text="Promote our new summer skincare line to Gen Z and Millennial audiences. Focus on natural ingredients and sustainable packaging."
            />

            <Section
              icon={Package}
              title={t("Product/Service Details")}
              text="Highlight key product benefits, ingredients, and value proposition clearly and authentically."
            />

            <div>
              <div className="flex items-center gap-2 text-Primary font-medium mb-1">
                <ClipboardList className="w-4 h-4" />
                <h4>{t("Content Requirements")}</h4>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                <li>Minimum 2 Instagram Feed Posts</li>
                <li>3 Stories With Swipe Up Links</li>
                <li>1 YouTube Short (30–60 Seconds)</li>
                <li>3 TikTok Videos Featuring Trending Sounds</li>
              </ul>
            </div>

            <DoDont />
          </div>
        </div>

        {/* ================= RIGHT : TERMS & CONDITIONS ================= */}
        <div className="space-y-4">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-Primary font-semibold">
              <ScrollText className="w-5 h-5" />
              <span className="text-base md:text-lg">
                {t("Terms & Conditions")}
              </span>
            </div>

            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle Campaign Brief"
              className="cursor-pointer hidden md:block"
            >
              <ChevronUp
                size={28}
                className={`text-Primary transition-transform duration-300 ${
                  open ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>
          </div>

          {/* COLLAPSIBLE CONTENT */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              open
                ? "max-h-[2000px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="space-y-5">
              <Section
                icon={BarChart3}
                title={t("Reporting Requirements")}
                text="Provide analytics screenshots 7 days post-publication including reach, engagement, and CTR."
              />

              <Section
                icon={ScrollText}
                title={t("Usage Rights")}
                text="Brand may reuse submitted content on official channels with proper attribution."
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ================= REUSABLE ================= */

function Section({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-Primary font-medium mb-1">
        <Icon className="w-4 h-4 shrink-0" />
        <h4 className="text-sm md:text-base">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}

function DoDont() {
  const t = useTranslations("influencer.campaign-details");
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{t("Do’s")}</span>
        </div>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Show authentic usage</li>
          <li>• Tag @StyleCo in all posts</li>
          <li>• Use natural lighting</li>
          <li>• Include discount codes</li>
        </ul>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
          <XCircle className="w-4 h-4" />
          <span>{t("Don’ts")}</span>
        </div>
        <ul className="text-sm text-red-600 space-y-1">
          <li>• Misrepresent product claims</li>
          <li>• Use misleading filters</li>
          <li>• Post without brand tags</li>
          <li>• Alter messaging without approval</li>
        </ul>
      </div>
    </div>
  );
}
