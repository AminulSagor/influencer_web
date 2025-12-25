"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  CheckCircle,
  CircleSlash,
  FileText,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";

const CampaignDetailsForm = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ================= LEFT ================= */}
      <Card className="border-none">
        <CardContent>
          <div className="space-y-6">
            {/* Campaign Goals */}
            <Section
              icon={<ClipboardList className="w-4 h-4 text-Primary" />}
              title="Campaign Goals"
            >
              <Textarea
                placeholder="Enter Brief Description About Your Campaign Goals"
                className="min-h-[120px]"
              />
            </Section>

            {/* Product / Service Details */}
            <Section
              icon={<FileText className="w-4 h-4 text-Primary" />}
              title="Product / Service Details"
            >
              <Textarea
                placeholder="Enter Brief Description About Your Product / Service Details"
                className="min-h-[120px]"
              />
            </Section>

            {/* Do's & Don'ts */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CircleSlash className="w-4 h-4 text-Primary" />
                <h2 className="text-base font-semibold text-Primary">
                  Do’s & Don’ts
                </h2>
              </div>

              {/* Do's */}
              <div className="rounded-xl border border-light-green bg-[#BBF7D0] p-4 space-y-2">
                <div className="flex items-center gap-2 text-Primary font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Do’s
                </div>

                <Textarea
                  placeholder={`Ex:\n• Show Authentic Usage, Mention Eco-Friendly Aspects\n• Tag @StyleCo in All Posts\n• Show Products in Natural Lighting\n• Include Discount Code in Captions`}
                  className="bg-white min-h-[100px]"
                />
              </div>

              {/* Don'ts */}
              <div className="rounded-xl border border-red-400 bg-[#FECACA] p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-500 font-semibold">
                  <CircleSlash className="w-4 h-4" />
                  Don’ts
                </div>

                <Textarea
                  placeholder={`Ex:\n• Misleading Claims\n• Use Competitor Branding\n• Excessive Filters\n• Offensive Language`}
                  className="bg-white min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT ================= */}
      <Card className="border-none">
        <CardContent>
          <div className="space-y-6">
            {/* Terms & Conditions */}
            <Section
              icon={<ShieldCheck className="w-4 h-4 text-Primary" />}
              title="Terms & Conditions"
            >
              <Textarea
                placeholder="Enter Terms & Conditions in details"
                className="min-h-[120px]"
              />
            </Section>

            {/* Reporting Requirements */}
            <Section
              icon={<ClipboardList className="w-4 h-4 text-Primary" />}
              title="Reporting Requirements"
            >
              <Textarea
                placeholder="Enter Reporting Requirements in details"
                className="min-h-[120px]"
              />
            </Section>

            {/* Usage Rights */}
            <Section
              icon={<ShieldCheck className="w-4 h-4 text-Primary" />}
              title="Usage Rights"
            >
              <Textarea
                placeholder="Enter Usage Rights in details"
                className="min-h-[120px]"
              />
            </Section>

            {/* Starting Date */}
            <Section title="Starting Date">
              <div className="relative">
                <Input placeholder="12 December 2025" className="h-12 pr-10" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange" />
              </div>
            </Section>

            {/* Duration */}
            <Section title="Duration">
              <Input placeholder="5 Days" className="h-12" />
            </Section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDetailsForm;

/* ================= Reusable Section ================= */

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-base font-semibold text-Primary">{title}</h2>
    </div>
    {children}
  </div>
);
