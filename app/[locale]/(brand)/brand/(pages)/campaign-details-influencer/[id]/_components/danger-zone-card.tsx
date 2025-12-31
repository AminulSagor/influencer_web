"use client";

import React from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function DangerZoneCard() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <X className="h-4 w-4" />
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold text-red-600">Danger Zone</p>
            <p className="text-[11px] text-red-500">Cancel Campaign</p>
          </div>
        </div>

        {open ? (
          <ChevronUp className="h-4 w-4 text-red-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-red-600" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <Textarea
            className="bg-white border-red-200"
            placeholder="Write your reason..."
          />
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            Request Cancellation & Submit Reason
          </Button>
        </div>
      )}
    </div>
  );
}
