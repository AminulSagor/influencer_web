import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";
import { SquarePen } from "lucide-react";

const skills = [
  "Public Speaking",
  "Voiceovers",
  "Podcasting",
  "Product Photography",
  "Conversion Optimization",
];

export default function SkillsCard() {
  return (
    <div>
      <CollapseCard
        title="Skills"
        icon={<SquarePen size={15} className="text-dark-gray" />}
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-sm bg-[#F1F6DE] text-[#2D5016]"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Action */}
        <button className="w-full border border-dashed border-[#9DB47B] rounded-lg py-2 text-sm text-[#2D5016] hover:bg-[#F7FAEC]">
          + Add Another Skills
        </button>
      </CollapseCard>
    </div>
  );
}
