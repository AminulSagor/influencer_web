"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BD_LOCATIONS } from "@/location-data/bd-location";
import { addAddress, updateAddress } from "@/service/influencer/address/address";
import { notifySuccess, notifyError } from "@/utils/toast_util";
import { addressSchema } from "@/schemas/influencer/address-validation";
import { Address } from "@/types/influencer/account_setting/profile_type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editingAddress?: Address | null;
};

export default function AddAddressModal({ open, onOpenChange, onSuccess, editingAddress }: Props) {
  const [addressName, setAddressName] = useState("");
  const [zilla, setZilla] = useState("");
  const [thana, setThana] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLocation = BD_LOCATIONS.find((loc) => loc.zila === zilla);
  const availableThanas = selectedLocation?.thanas || [];

  useEffect(() => {
    if (open && editingAddress) {
      setAddressName(editingAddress.addressName || "");
      setZilla(editingAddress.zilla || "");
      setThana(editingAddress.thana || "");
      setFullAddress(editingAddress.fullAddress || "");
    } else if (!open) {
      setAddressName("");
      setZilla("");
      setThana("");
      setFullAddress("");
    }
  }, [open, editingAddress]);

  const handleZillaChange = (value: string) => {
    setZilla(value);
    setThana("");
  };

  const handleSubmit = async () => {
    const parsed = addressSchema.safeParse({
      addressName: addressName.trim(),
      zilla,
      thana,
      fullAddress: fullAddress.trim(),
    });

    if (!parsed.success) {
      notifyError(parsed.error.issues[0]?.message || "Invalid address");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingAddress) {
        await updateAddress(editingAddress.addressName, {
          addressName: addressName.trim(),
          thana,
          zilla,
          fullAddress: fullAddress.trim(),
        });
        notifySuccess("Address updated successfully");
      } else {
        await addAddress({
          addresses: [{
            addressName: addressName.trim(),
            thana,
            zilla,
            fullAddress: fullAddress.trim(),
          }],
        });
        notifySuccess("Address added successfully");
      }

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Failed to save address:", error);
      notifyError(error?.response?.data?.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-[#2D5016]">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-[#2D5016]">
              Give A Name
            </label>
            <Input
              placeholder="Give A Name To The Address"
              className="mt-1"
              value={addressName}
              onChange={(e) => setAddressName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#2D5016]">
              Zilla *
            </label>
            <Select value={zilla} onValueChange={handleZillaChange} disabled={isSubmitting}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Zilla" />
              </SelectTrigger>
              <SelectContent>
                {BD_LOCATIONS.map((location) => (
                  <SelectItem key={location.zila} value={location.zila}>
                    {location.zila}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#2D5016]">
              Thana *
            </label>
            <Select value={thana} onValueChange={setThana} disabled={!zilla || isSubmitting}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={zilla ? "Select Thana" : "Select Zilla first"} />
              </SelectTrigger>
              <SelectContent>
                {availableThanas.map((thanaName) => (
                  <SelectItem key={thanaName} value={thanaName}>
                    {thanaName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#2D5016]">
              Full Address *
            </label>
            <Textarea
              placeholder="Enter Full Address"
              className="mt-1 min-h-[100px]"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <Button
            className="w-full bg-[#6E8F4A] hover:bg-[#5d7a3e]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
