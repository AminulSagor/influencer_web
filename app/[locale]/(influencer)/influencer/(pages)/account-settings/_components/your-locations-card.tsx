"use client";

import AddAddressModal from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/address-drawer";
import { MapPin, Pencil, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function YourLocationsCard() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("influencer.account-setting");
  return (
    <>
      <div className="rounded-2xl border bg-white p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold text-[#2D5016]">Your Locations</h3>
          <ExternalLink className="w-4 h-4 text-[#6B7A4C]" />
        </div>

        {/* Location item */}
        <div className="flex items-center justify-between rounded-xl border border-[#9DB47B] bg-[#F7FAEC] p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#6E8F4A] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#2D5016]">House</p>
              <p className="text-xs text-[#6B7A4C]">
                House 61, Road 8, Block F, Banani, Dhaka 1213
              </p>
            </div>
          </div>

          <Pencil className="w-4 h-4 text-[#6B7A4C] cursor-pointer" />
        </div>

        {/* Add address */}
        <button
          onClick={() => setOpen(true)}
          className="w-full border border-dashed border-[#9DB47B] rounded-lg py-2 text-sm text-[#2D5016]"
        >
          + Add Another Address
        </button>
      </div>

      <AddAddressModal open={open} onOpenChange={setOpen} />
    </>
  );
}
