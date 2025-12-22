"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddAddressModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-[#2D5016]">Add New Address</DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-4 mt-2">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-[#2D5016]">
              Give A Name
            </label>
            <Input placeholder="Give A Name To The Address" className="mt-1" />
          </div>

          {/* Thana */}
          <div>
            <label className="text-sm font-medium text-[#2D5016]">
              Thana *
            </label>
            <div className="relative mt-1">
              <Input placeholder="Select Thana" readOnly />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A4C]" />
            </div>
          </div>

          {/* Zilla */}
          <div>
            <label className="text-sm font-medium text-[#2D5016]">
              Zilla *
            </label>
            <div className="relative mt-1">
              <Input placeholder="Select Zilla" readOnly />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A4C]" />
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="text-sm font-medium text-[#2D5016]">
              Full Address *
            </label>
            <Textarea
              placeholder="Enter Full Address"
              className="mt-1 min-h-[100px]"
            />
          </div>

          {/* Submit */}
          <Button className="w-full bg-[#6E8F4A] hover:bg-[#5d7a3e]">
            Save Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
