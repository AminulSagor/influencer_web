"use client";

import { Bell } from "lucide-react";

type Props = {
  title: string;
  showNotify?: boolean;
  onNotify?: () => void;
};

export default function SectionHeader({ title, showNotify, onNotify }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-black">{title}</h3>

      {showNotify ? (
        <button
          type="button"
          onClick={onNotify}
          className="inline-flex items-center gap-2 rounded-md bg-orange px-4 py-2 text-sm font-medium text-white hover:brightness-95 active:scale-[0.98]"
        >
          <Bell className="h-4 w-4" />
          Notify
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}