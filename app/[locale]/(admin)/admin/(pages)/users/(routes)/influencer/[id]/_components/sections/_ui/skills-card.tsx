"use client";

import ActionButtons from "./action-buttons";
import Chip from "./chip";
import SectionHeader from "./section-header";

type Props = {
  skills: string[];
};

export default function SkillsCard({ skills }: Props) {
  return (
    <div className="rounded-xl border border-primary/15 bg-white p-6">
      <SectionHeader title="Skills" showNotify />

      <div className="mt-5 flex flex-wrap gap-3">
        {(skills ?? []).length === 0 ? (
          <div className="text-sm text-light-gray">No skills found.</div>
        ) : (
          skills.map((s, idx) => <Chip key={`${s}-${idx}`} label={s} />)
        )}
      </div>

      <div className="mt-6">
        <ActionButtons rightLabel="Accept" />
      </div>
    </div>
  );
}