import { Pencil, ChevronUp, Check } from "lucide-react";

const niches = ["Lifestyle", "Skincare", "Vlogging"];

export default function NichesCard() {
  return (
    <div className="rounded-2xl border bg-white p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[#2D5016]">Niches</h3>
          <Pencil className="w-4 h-4 text-[#6B7A4C] cursor-pointer" />
        </div>
        <ChevronUp className="w-5 h-5 text-[#6B7A4C]" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {niches.map((niche) => (
          <span
            key={niche}
            className="px-3 py-1 rounded-full text-sm bg-[#F1F6DE] text-[#2D5016] flex items-center gap-1"
          >
            {niche}
            <Check className="w-3 h-3" />
          </span>
        ))}
      </div>

      {/* Action */}
      <button className="w-full border border-dashed border-[#9DB47B] rounded-lg py-2 text-sm text-[#2D5016] hover:bg-[#F7FAEC]">
        + Add Another Niche
      </button>
    </div>
  );
}
