"use client";

import { useState } from "react";
import AddAddressModal from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/address-drawer";
import { MapPin, Pencil, ExternalLink, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { InfluencerProfileData, Address } from "@/types/influencer/account_setting/profile_type";

interface YourLocationsCardProps {
  profileData: InfluencerProfileData | null;
  loading: boolean;
  refreshProfile?: () => void;
}

export default function YourLocationsCard({ profileData, loading, refreshProfile }: YourLocationsCardProps) {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const t = useTranslations("influencer.account-setting");

  const addresses = profileData?.addresses || [];

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setOpen(true);
  };

  return (
    <>
      <div className="rounded-2xl border bg-white p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold text-[#2D5016]">Your Locations</h3>
          <ExternalLink className="w-4 h-4 text-[#6B7A4C]" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-light-green" />
          </div>
        ) : addresses.length > 0 ? (
          <div className="space-y-4 mb-4">
            {addresses.map((address, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-[#9DB47B] bg-[#F7FAEC] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#6E8F4A] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#2D5016]">
                      {address.addressName || "Address"}
                    </p>
                    <p className="text-xs text-[#6B7A4C]">
                      {address.fullAddress || `${address.thana}, ${address.zilla}, ${address.country}`}
                    </p>
                  </div>
                </div>

                <Pencil
                  className="w-4 h-4 text-[#6B7A4C] cursor-pointer shrink-0"
                  onClick={() => handleEdit(address)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 mb-4">
            No addresses added yet
          </div>
        )}

        {/* Add address */}
        <button
          onClick={handleAdd}
          className="w-full border border-dashed border-[#9DB47B] rounded-lg py-2 text-sm text-[#2D5016] hover:bg-[#F7FAEC] transition-colors"
        >
          + Add Another Address
        </button>
      </div>

      <AddAddressModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={refreshProfile}
        editingAddress={editingAddress}
      />
    </>
  );
}
