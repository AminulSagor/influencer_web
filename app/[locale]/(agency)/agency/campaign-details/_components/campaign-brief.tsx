import { GoGoal } from "react-icons/go";
import { FaRegCircleCheck } from "react-icons/fa6";
import { VscPinned } from "react-icons/vsc";
import { FaFileAlt } from "react-icons/fa";
import type { AgencyCampaignMilestone } from "@/types/agency/job-details";

interface Props {
  campaignGoals: string;
  milestones: AgencyCampaignMilestone[];
  dos: string;
  donts: string;
}

const toList = (value: string) => {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const CampaignBrief = ({ campaignGoals, milestones, dos, donts }: Props) => {
  const doList = toList(dos);
  const dontList = toList(donts);

  return (
    <div className="flex-3 md:border-r-2 mr-4 space-y-2 pr-4">
      <div className="text-Primary flex items-center gap-2 mb-6">
        <span>
          <FaFileAlt />
        </span>
        <h3 className="font-semibold text-base">Campaign Brief</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <div className="text-Primary flex items-center gap-2">
            <span>
              <GoGoal />
            </span>
            <h3 className="font-semibold text-sm">Campaign Goals</h3>
          </div>
          <p className="text-sm text-gray-500">{campaignGoals}</p>
        </div>

        <div className="space-y-2">
          <div className="text-Primary flex items-center gap-2">
            <span>
              <VscPinned />
            </span>
            <h3 className="font-semibold text-sm">Content Requirement</h3>
          </div>
          <ul className="text-sm text-gray-500 space-y-1">
            {milestones.map((milestone) => (
              <li key={milestone.id} className="list-disc ml-5">
                {milestone.contentTitle} - {milestone.contentQuantity}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-Primary flex items-center gap-2">
            <h3 className="font-semibold text-sm">Do&apos;s and Don&apos;ts</h3>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4">
            <h3 className="text-light-green-600 flex items-center gap-2 text-xl font-medium">
              <FaRegCircleCheck />
              Do&apos;s
            </h3>
            <ul className="list-disc ml-[22px] text-sm pt-2 text-light-green-600">
              {doList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-md p-4">
            <h3 className="text-rose-600 flex items-center gap-2 text-xl font-medium">
              <FaRegCircleCheck />
              Don&apos;ts
            </h3>
            <ul className="list-disc ml-[22px] text-sm pt-2 text-rose-600">
              {dontList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBrief;