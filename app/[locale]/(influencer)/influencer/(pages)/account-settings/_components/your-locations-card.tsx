"use client";

import { useState } from "react";
import AddAddressModal from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/address-drawer";
import { ExternalLink, Loader2, MapPin, Pencil, Trash2 } from "lucide-react";
import { InfluencerProfileData, Address } from "@/types/influencer/account_setting/profile_type";
import { deleteAddress } from "@/service/influencer/address/address";
import { notifyError, notifySuccess } from "@/utils/toast_util";

interface YourLocationsCardProps {
  profileData: InfluencerProfileData | null;
  loading: boolean;
  refreshProfile?: () => void;
}

export default function YourLocationsCard({
  profileData,
  loading,
  refreshProfile,
}: YourLocationsCardProps) {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddressName, setDeletingAddressName] = useState<string | null>(
    null,
  );

  const addresses = profileData?.addresses || [];

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setOpen(true);
  };

  const handleDelete = async (address: Address) => {
    if (!address.addressName) {
      notifyError("Address name is required to delete this address");
      return;
    }

    try {
      setDeletingAddressName(address.addressName);
      const response = await deleteAddress(address.addressName);
      notifySuccess(response.message || "Address deleted successfully");
      refreshProfile?.();
    } catch (error: any) {
      notifyError(error?.response?.data?.message || "Failed to delete address");
    } finally {
      setDeletingAddressName(null);
    }
  };

  return (
    <>
      <div className="rounded-2xl border bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="font-semibold text-[#2D5016]">Your Locations</h3>
          <ExternalLink className="h-4 w-4 text-[#6B7A4C]" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-light-green" />
          </div>
        ) : addresses.length > 0 ? (
          <div className="mb-4 space-y-4">
            {addresses.map((address, index) => {
              const isDeleting = deletingAddressName === address.addressName;

              return (
                <div
                  key={`${address.addressName}-${address.fullAddress}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#9DB47B] bg-[#F7FAEC] p-4"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6E8F4A]">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#2D5016]">
                        {address.addressName || "Address"}
                      </p>
                      <p className="break-words text-xs text-[#6B7A4C]">
                        {address.fullAddress ||
                          `${address.thana}, ${address.zilla}, ${address.country}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(address)}
                      className="rounded-full p-1 text-[#6B7A4C] hover:bg-[#2D5016]/10 hover:text-[#2D5016]"
                      disabled={isDeleting}
                      aria-label="Edit address"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(address)}
                      className="rounded-full p-1 text-red-600 hover:bg-red-100 disabled:opacity-50"
                      disabled={isDeleting}
                      aria-label="Delete address"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mb-4 py-4 text-center text-gray-500">
            No addresses added yet
          </div>
        )}

        <button
          onClick={handleAdd}
          className="w-full rounded-lg border border-dashed border-[#9DB47B] py-2 text-sm text-[#2D5016] transition-colors hover:bg-[#F7FAEC]"
          type="button"
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
