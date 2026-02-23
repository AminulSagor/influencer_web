"use client";


import type { InfluencerVerificationStatus } from "@/types/admin/user/influencer-verification-profile_type";
import SectionHeader from "./section-header";
import ActionButtons from "./action-buttons";

type Props = {
  nidNumber: string | null;
  frontImg: string | null;
  backImg: string | null;
  status?: InfluencerVerificationStatus;
};

function isUploadValue(v: string | null) {
  if (!v) return false;
  return v !== "pending-upload";
}

export default function NidInfoCard({ nidNumber, frontImg, backImg }: Props) {
  return (
    <div className="rounded-xl border border-primary/15 bg-white p-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="NID Info" showNotify />
      </div>

      <div className="mt-4">
        <div className="text-sm font-semibold text-black">NID Number</div>
        <div className="mt-2 text-2xl font-semibold text-Primary">
          {nidNumber || "—"}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <div className="text-sm font-semibold text-black">Front Side of NID</div>
          <div className="mt-2 grid h-36 place-items-center rounded-lg border border-dashed border-primary/25 bg-off-white text-sm text-light-gray">
            {isUploadValue(frontImg) ? "Front Image Uploaded" : "Front Side of NID"}
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="text-sm font-semibold text-black">Back Side of NID</div>
          <div className="mt-2 grid h-36 place-items-center rounded-lg border border-dashed border-primary/25 bg-off-white text-sm text-light-gray">
            {isUploadValue(backImg) ? "Back Image Uploaded" : "Back Side of NID"}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ActionButtons />
      </div>
    </div>
  );
}