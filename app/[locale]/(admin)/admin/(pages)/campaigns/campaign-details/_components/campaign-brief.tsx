import { GoGoal } from "react-icons/go";
import { VscPinned } from "react-icons/vsc";
import { FaFileAlt } from "react-icons/fa";

type Milestone = {
  id: string;
  contentTitle: string;
  contentQuantity: string;
};

export default function CampaignBrief({
  campaignGoals,
  productServiceDetails,
  needSampleProduct,
  milestones,
}: {
  campaignGoals: string;
  productServiceDetails: string;
  needSampleProduct: boolean;
  milestones: Milestone[];
}) {
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
          <p className="text-sm text-gray-500">{campaignGoals || "-"}</p>
        </div>

        <div className="space-y-2">
          <div className="text-Primary flex items-center gap-2">
            <span>
              <VscPinned />
            </span>
            <h3 className="font-semibold text-sm">Product / Service Details</h3>
          </div>
          <p className="text-sm text-gray-500">{productServiceDetails || "-"}</p>
        </div>

        <div className="space-y-2">
          <div className="text-Primary flex items-center gap-2">
            <span>
              <VscPinned />
            </span>
            <h3 className="font-semibold text-sm">Content Requirement</h3>
          </div>

          {milestones?.length ? (
            <ul className="text-sm text-gray-500 space-y-1">
              {milestones.map((m) => (
                <li key={m.id} className="list-disc ml-5">
                  {m.contentTitle}: {m.contentQuantity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">-</p>
          )}
        </div>

        <div className="text-sm text-gray-500">
          Sample product needed:{" "}
          <span className="font-semibold">{needSampleProduct ? "Yes" : "No"}</span>
        </div>
      </div>
    </div>
  );
}
