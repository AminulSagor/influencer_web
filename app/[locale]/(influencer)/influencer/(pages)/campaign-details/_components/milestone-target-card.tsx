import { Eye, Play, Heart, MessageCircle } from "lucide-react";

type MilestoneTarget = {
  reach: number;
  views: number;
  reactions: number;
  comments: number;
};

const formatK = (num: number) => `${Math.round(num / 1000)}K`;

export default function MilestoneTargetCard({
  milestoneTarget,
}: {
  milestoneTarget: MilestoneTarget;
}) {
  return (
    <div>
      {/* Grid */}
      <div className="grid grid-cols-2 gap-2 xl:gap-4">
        <TargetBox
          label="Reach"
          value={formatK(milestoneTarget.reach)}
          icon={<Eye className="w-5 h-5" />}
        />
        <TargetBox
          label="Views"
          value={formatK(milestoneTarget.views)}
          icon={<Play className="w-5 h-5" />}
        />
        <TargetBox
          label="Reaction"
          value={formatK(milestoneTarget.reactions)}
          icon={<Heart className="w-5 h-5" />}
        />
        <TargetBox
          label="Comment"
          value={formatK(milestoneTarget.comments)}
          icon={<MessageCircle className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}

function TargetBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border-2 border-Primary bg-[#F7F8E6] p-2 text-sm">
      <div className="flex items-center justify-between text-Primary gap-2">
        <span className="text-xs font-medium">{label}</span>
        {icon}
      </div>

      <p className="text-xl font-bold text-Primary">{value}</p>
    </div>
  );
}
