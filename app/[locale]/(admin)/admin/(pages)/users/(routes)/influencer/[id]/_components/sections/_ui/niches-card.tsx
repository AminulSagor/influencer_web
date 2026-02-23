"use client";

import ActionButtons from "./action-buttons";
import Chip from "./chip";
import SectionHeader from "./section-header";



type Props = {
  niches: string[];
};

export default function NichesCard({ niches }: Props) {
  return (
    <div className="rounded-xl border border-primary/15 bg-white p-6">
      <SectionHeader title="Niches" showNotify />

      <div className="mt-5 space-y-3">
        {(niches ?? []).length === 0 ? (
          <div className="text-sm text-light-gray">No niches found.</div>
        ) : (
          niches.map((n, idx) => (
            <div key={`${n}-${idx}`} className="flex items-center justify-between gap-3">
              <Chip label={n} />
              <ActionButtons />
            </div>
          ))
        )}

        <button
          type="button"
          className="mt-4 w-full rounded-lg border border-dashed border-primary/40 bg-off-white py-3 text-sm font-medium text-Primary hover:bg-Primary/5"
        >
          + Add Another Niche
        </button>
      </div>
    </div>
  );
}