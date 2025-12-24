"use client";

import { useState } from "react";
import {
  AlertTriangle,
  SquarePen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import UploadBox from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/upload-button";
import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";

export default function VerificationMethodsCard() {
  // files (ready for API)
  const [frontNid, setFrontNid] = useState<File | null>(null);
  const [backNid, setBackNid] = useState<File | null>(null);

  return (
    <CollapseCard
      title="Verification Methods"
      titleColor="text-[#E67E22]"
      icon={<SquarePen size={15} className="text-[#E67E22]" />}
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
    </CollapseCard>
  );
}
