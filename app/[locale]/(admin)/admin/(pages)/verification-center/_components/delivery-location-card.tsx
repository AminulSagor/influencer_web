import React from "react";

import { MdLocationOn } from "react-icons/md";
import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";
import IconText from "../../../../campaigns/campaign-details/_components/icon-text";

const DeliveryLocationCard = () => {
  return (
    <CollapsibleCard heading="Delivery Location">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div
            className="border-light-green border rounded-md p-4 bg-linear-to-r
          from-white to-Secondary"
          >
            <div className="space-y-4">
              <IconText
                className="text-Primary text-lg font-semibold "
                icon={<MdLocationOn size={20} />}
                text="House"
              />
              <p className="text-gray-400">
                House 61, Road 8, Block F, Banani, Dhaka 1213
              </p>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default DeliveryLocationCard;
