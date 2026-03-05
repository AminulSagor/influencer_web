import { GoGoal } from "react-icons/go";
import { FaRegCircleCheck } from "react-icons/fa6";
import { VscPinned } from "react-icons/vsc";
import { FaFileAlt } from "react-icons/fa";
const CampaignBrief = () => {
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
          <p className="text-sm text-gray-500">
            Promote our new summer skincare line to Gen Z and millennial
            audiences. Focus on natural ingredients and sustainable packaging.
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-Primary flex items-center gap-2">
            <span>
              <VscPinned />
            </span>
            <h3 className="font-semibold text-sm">Content Requirement</h3>
          </div>
          <ul className="text-sm text-gray-500 space-y-1">
            <li className="list-disc ml-5">Minimum 2 Instagram Feed posts</li>
            <li className="list-disc ml-5">3 stories with swipe up links</li>
            <li className="list-disc ml-5">1 YouTube short (30-60 seconds)</li>
            <li className="list-disc ml-5">
              3 TikTok video Featuring trending sounds
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-Primary flex items-center gap-2">
            <h3 className="font-semibold text-sm">Do's and Don'ts</h3>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4">
            <h3 className="text-light-green-600 flex items-center gap-2 text-xl font-medium">
              <FaRegCircleCheck />
              Do's
            </h3>
            <ul className="list-disc ml-[22px] text-sm pt-2 text-light-green-600">
              <li>Show authentic usage, mention eco-friendly aspects</li>
              <li>tag @styleCo in All post</li>
              <li>show products in natural lighting</li>
              <li>include discount code in captions</li>
            </ul>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-md p-4">
            <h3 className="text-rose-600 flex items-center gap-2 text-xl font-medium">
              <FaRegCircleCheck />
              Do's
            </h3>
            <ul className="list-disc ml-[22px] text-sm pt-2 text-rose-600">
              <li>Show authentic usage, mention eco-friendly aspects</li>
              <li>tag @styleCo in All post</li>
              <li>show products in natural lighting</li>
              <li>include discount code in captions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBrief;
