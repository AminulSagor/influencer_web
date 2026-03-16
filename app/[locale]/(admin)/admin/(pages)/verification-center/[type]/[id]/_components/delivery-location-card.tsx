import React from "react";
import CollapsibleCard from "./collapsible-card";
import IconText from "./icon-text";
import { MdLocationOn } from "react-icons/md";

interface DeliveryLocation {
  title: string;
  address: string;
}

interface Props {
  locations: DeliveryLocation[];
}

const DeliveryLocationCard = ({ locations }: Props) => {
  const safeLocations =
    locations?.filter((item) => item.address?.trim()) ?? [];

  return (
    <CollapsibleCard heading="Delivery Location">
      <div className="grid grid-cols-12 gap-4">
        {safeLocations.length > 0 ? (
          safeLocations.map((location, index) => (
            <div
              key={`${location.title}-${index}`}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <div
                className="border-light-green border rounded-md p-4 bg-linear-to-r
                from-white to-Secondary"
              >
                <div className="space-y-4">
                  <IconText
                    className="text-Primary text-lg font-semibold"
                    icon={<MdLocationOn size={20} />}
                    text={location.title}
                  />
                  <p className="text-gray-400">{location.address}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-12">
            <div className="border-light-green border rounded-md p-4 bg-linear-to-r from-white to-Secondary">
              <p className="text-gray-400">No location available</p>
            </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default DeliveryLocationCard;