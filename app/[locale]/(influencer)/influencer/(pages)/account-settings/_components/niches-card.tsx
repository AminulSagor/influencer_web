import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";
import { Check, SquarePen } from "lucide-react";

const niches = ["Lifestyle", "Skincare", "Vlogging"];

export default function NichesCard() {
  return (
    <div>
      <CollapseCard
        title="Niches"
        icon={<SquarePen size={15} className="text-dark-gray" />}
      >
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
      </CollapseCard>
    </div>
  );
}
