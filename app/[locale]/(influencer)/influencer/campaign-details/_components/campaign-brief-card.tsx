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
import { cn } from "@/lib/utils";

export default function CampaignBriefSection() {
  const [open, setOpen] = useState(true);

  return (
    <Card className="rounded-2xl border bg-white p-6 relative">
      {/* Collapse button (XL) */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-6 right-6"
      >
        <ChevronUp
          className={cn(
            "w-7 h-7 text-Primary transition-transform duration-300",
            !open && "rotate-180"
          )}
        />
      </button>

      {/* COLLAPSED PREVIEW (GOOD UX) */}
      {!open && (
        <div className="flex items-center justify-evenly   gap-8 text-Primary font-semibold">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Campaign Brief</span>
          </div>

          <div className="w-px h-5 bg-gray-300" />

          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5" />
            <span>Terms & Conditions</span>
          </div>
        </div>
      )}

      {/* EXPANDED CONTENT */}
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          open ? "max-h-[2000px] opacity-100 mt-0" : "max-h-0 opacity-0"
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-Primary font-semibold">
              <FileText className="w-5 h-5" />
              <span className="text-lg">Campaign Brief</span>
            </div>

            <Section
              icon={Target}
              title="Campaign Goals"
              text="Promote our new summer skincare line to Gen Z and Millennial audiences. Focus on natural ingredients and sustainable packaging."
            />

            <Section
              icon={Package}
              title="Product / Service Details"
              text="Promote our new summer skincare line to Gen Z and Millennial audiences. Focus on natural ingredients and sustainable packaging."
            />

            <div>
              <div className="flex items-center gap-2 text-Primary font-medium mb-1">
                <ClipboardList className="w-4 h-4" />
                <h4>Content Requirements</h4>
              </div>

              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                <li>Minimum 2 Instagram Feed Posts</li>
                <li>3 Stories With Swipe Up Links</li>
                <li>1 YouTube Short (30–60 Seconds)</li>
                <li>3 TikTok Video Featuring Trending Sounds</li>
              </ul>
            </div>

            <DoDont />
          </div>

          {/* VERTICAL SEPARATOR */}
          <div className="hidden lg:flex justify-center">
            <div className="w-px bg-gray-200" />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-Primary font-semibold">
              <ScrollText className="w-5 h-5" />
              <span className="text-lg">Terms & Conditions</span>
            </div>

            <Section
              icon={BarChart3}
              title="Reporting Requirements"
              text="Provide analytics screenshots 7 days post-publication. Include reach, engagement, and click-through rates."
            />

            <Section
              icon={ScrollText}
              title="Usage Rights"
              text="Brand retains rights to repost content on official channels with proper attribution."
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- Reusable ---------------- */

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
        <Icon className="w-4 h-4" />
        <h4>{title}</h4>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function DoDont() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Do’s</span>
        </div>

        <ul className="text-sm text-green-700 space-y-1">
          <li>• Show Authentic Usage, Mention Eco-Friendly Aspects</li>
          <li>• Tag @StyleCo In All Posts</li>
          <li>• Show Products In Natural Lighting</li>
          <li>• Include Discount Code In Captions</li>
        </ul>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
          <XCircle className="w-4 h-4" />
          <span>Don’ts</span>
        </div>

        <ul className="text-sm text-red-600 space-y-1">
          <li>• Misrepresent Product Claims</li>
          <li>• Use Heavy Filters Or Misleading Edits</li>
          <li>• Post Without Brand Tags</li>
          <li>• Alter Messaging Without Approval</li>
        </ul>
      </div>
    </div>
  );
}
