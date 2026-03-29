"use client";

import { MapPin, Pencil, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SavedLocation } from "./delivery-location";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  savedLocations: SavedLocation[];
  onSelect: (addressName: string) => void;
  onEdit: (addressName: string) => void;
  onAdd: () => void;
};

const LocationSelectDialog = ({
  open,
  onOpenChange,
  savedLocations,
  onSelect,
  onEdit,
  onAdd,
}: Props) => {
  const t = useTranslations("influencer.campaign-details");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            className="border-light-green text-Primary bg-linear-to-l from-bg-white to-Secondary max-w-44"
          >
            {t("change")}
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 max-w-sm">
        <Card>
          <CardHeader>
            <DialogTitle asChild>
              <CardTitle className="flex items-center gap-2 text-Primary">
                <MapPin size={20} />
                {t("Where to send the product?")}
              </CardTitle>
            </DialogTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {savedLocations.map((location) => (
              <div
                key={location.addressName}
                onClick={() => onSelect(location.addressName)}
                className={`w-full rounded-md border p-3 flex items-start gap-3 cursor-pointer
                  ${
                    location.isSelected
                      ? "border-light-green bg-Secondary"
                      : "hover:bg-muted"
                  }`}
              >
                {/* Radio circle */}
                <div className="mt-1 shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${location.isSelected ? "border-light-green" : "border-gray-300"}`}
                  >
                    {location.isSelected && (
                      <div className="w-2 h-2 rounded-full bg-light-green" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-Primary">{location.addressName}</p>
                    {location.isDefault && (
                      <span className="text-xs font-medium text-light-green bg-light-green/10 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-dark-gray mt-1">
                    {location.fullAddress}
                  </p>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(location.addressName);
                  }}
                  className="text-light-green hover:text-Primary mt-1 shrink-0"
                >
                  <Pencil size={16} />
                </div>
              </div>
            ))}

            {/* Add Another */}
            <div
              onClick={onAdd}
              className="w-full rounded-md border border-dashed border-light-green p-3 text-light-green cursor-pointer hover:bg-Secondary flex justify-center gap-2"
            >
              <Plus size={18} />
              {t("Add Another")}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelectDialog;
