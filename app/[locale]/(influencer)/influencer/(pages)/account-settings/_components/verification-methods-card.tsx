"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import UploadBox from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/upload-button";

export default function VerificationMethodsCard() {
  const [open, setOpen] = useState(true);

  // files (ready for API)
  const [frontNid, setFrontNid] = useState<File | null>(null);
  const [backNid, setBackNid] = useState<File | null>(null);

  return (
    <Card className="rounded-2xl border p-6">
      {/* Header */}
      <div
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[#E67E22]">
            Verification Methods
          </h3>
          <ExternalLink className="w-4 h-4 text-[#E67E22]" />
        </div>

        <ChevronUp
          className={cn(
            "w-5 h-5 text-Primary transition-transform duration-300",
            !open && "rotate-180"
          )}
        />
      </div>

      {/* Collapsible Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {/* Warning */}
        <div className="flex items-center gap-2 bg-[#FDECEC] text-[#E74C3C] text-sm rounded-lg px-4 py-2 mb-6">
          <AlertTriangle className="w-4 h-4" />
          <span>Verification Required. Please Provide Documents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* NID number */}
          <div>
            <label className="text-sm font-medium text-[#E67E22]">
              Your NID Number
            </label>
            <Input placeholder="Enter your NID Number" className="mt-1" />
          </div>

          <UploadBox
            label="Front Side of NID"
            file={frontNid}
            onFileChange={setFrontNid}
          />

          <UploadBox
            label="Back Side of NID"
            file={backNid}
            onFileChange={setBackNid}
          />
        </div>
      </div>
    </Card>
  );
}
