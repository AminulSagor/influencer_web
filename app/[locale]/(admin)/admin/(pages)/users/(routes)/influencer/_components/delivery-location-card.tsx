import { MapPin } from "lucide-react";
import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface DeliveryLocationItem {
  id: string;
  title: string;
  address: string;
}

interface Props {
  locations?: DeliveryLocationItem[];
}

const DeliveryLocationCard = ({ locations = [] }: Props) => {
  return (
    <CollapsibleCard heading="Delivery Locations">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {locations.length > 0 ? (
          locations.map((location) => (
            <div
              key={location.id}
              className="rounded-lg border border-light-green bg-linear-to-r from-white to-Secondary p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-light-green text-white">
                  <MapPin size={16} />
                </div>

                <div>
                  <h3 className="font-semibold text-Primary">{location.title}</h3>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No delivery locations available
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default DeliveryLocationCard;