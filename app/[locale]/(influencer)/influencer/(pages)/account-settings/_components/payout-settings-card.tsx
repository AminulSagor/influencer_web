"use client";

import {
  ChevronUp,
  Landmark,
  Wallet,
  Check,
  X,
  Pencil,
} from "lucide-react";

export default function PayoutSettingsCard() {
  return (
    <div className="rounded-2xl border bg-white p-6 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[#2D5016]">Payout Settings</h3>
          <Pencil className="w-4 h-4 text-[#6B7A4C]" />
        </div>
        <ChevronUp className="w-5 h-5 text-[#6B7A4C]" />
      </div>

      {/* Existing payout methods */}
      <div className="space-y-3 mb-5">
        {/* Approved bank */}
        <div className="flex items-center justify-between rounded-xl border border-[#9DB47B] bg-[#F7FAEC] p-4  overflow-y-scroll no-scrollbar">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#6E8F4A] flex items-center justify-center">
              <Landmark className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#2D5016]">
                Bank Account No.1
              </p>
              <p className="text-xs text-[#6B7A4C]">DBBL</p>
              <p className="text-xs text-[#6B7A4C]">
                Account No: ****-***-989
              </p>
            </div>
          </div>

          <button className="px-4 py-1.5 rounded-full bg-[#6E8F4A] text-white text-xs">
            Remove
          </button>
        </div>

        {/* Bkash */}
        <div className="flex items-center justify-between rounded-xl border border-[#9DB47B] bg-[#FBFDF6] p-4  overflow-y-scroll no-scrollbar">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E2136E] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#2D5016]">
                +8801234567890
              </p>
              <p className="text-xs text-[#6B7A4C]">Bkash</p>
              <p className="text-xs text-[#6B7A4C]">Hania Amir</p>
            </div>
          </div>

          <button className="px-4 py-1.5 rounded-full bg-[#6E8F4A] text-white text-xs">
            Remove
          </button>
        </div>

        {/* In review */}
        <div className="flex items-center justify-between rounded-xl border border-[#FFC48A] bg-[#FFF7ED] p-4  overflow-y-scroll no-scrollbar">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E57A1F] flex items-center justify-center">
              <Landmark className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#C96A1B]">
                Bank Account No.1
              </p>
              <p className="text-xs text-[#C96A1B]">DBBL</p>
              <p className="text-xs text-[#C96A1B]">
                Account No: ****-***-989
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#FFE5CC] text-[#C96A1B] text-xs">
            In Review
          </span>
        </div>
      </div>

      {/* Add new payout method */}
      <div className="rounded-xl border p-4 space-y-4 mb-6  overflow-y-scroll no-scrollbar">
        {/* Method selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6E8F4A] flex items-center justify-center">
              <Landmark className="w-4 h-4 text-white" />
            </div>

            <select className="border rounded-lg px-3 py-1.5 text-sm outline-none">
              <option>Bank</option>
              <option>Bkash</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Check className="w-5 h-5 text-[#6E8F4A] cursor-pointer" />
            <X className="w-5 h-5 text-[#C96A1B] cursor-pointer" />
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-3">
          <Input label="Bank Name" placeholder="Enter Bank Name" />
          <Input
            label="Bank Account Holder Name"
            placeholder="Enter Account Holder Name"
          />
          <Input
            label="Bank Account No"
            placeholder="Enter Bank Account No."
          />
          <Input
            label="Routing Number"
            placeholder="Enter Routing Number"
          />
        </div>
      </div>

      {/* Add another */}
      <button className="w-full border border-dashed border-[#9DB47B] rounded-lg py-2 text-sm text-[#2D5016] hover:bg-[#F7FAEC]">
        + Add Another Payout Method
      </button>
    </div>
  );
}

/* Reusable input */
function Input({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm text-[#6B7A4C] mb-1  overflow-y-scroll no-scrollbar">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6E8F4A]"
      />
    </div>
  );
}
