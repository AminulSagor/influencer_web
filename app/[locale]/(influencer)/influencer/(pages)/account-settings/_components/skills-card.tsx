import { Pencil, ChevronUp } from "lucide-react";

const skills = [
  "Public Speaking",
  "Voiceovers",
  "Podcasting",
  "Product Photography",
  "Conversion Optimization",
];

export default function SkillsCard() {
  return (
    <div className="rounded-2xl border bg-white p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[#2D5016]">Skills</h3>
          <Pencil className="w-4 h-4 text-[#6B7A4C] cursor-pointer" />
        </div>
        <ChevronUp className="w-5 h-5 text-[#6B7A4C]" />
      </div>

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
    </div>
  );
}
