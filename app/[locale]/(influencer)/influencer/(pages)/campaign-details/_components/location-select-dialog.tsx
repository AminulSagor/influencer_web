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
  onSelect: (locationId: string) => void;
  onEdit: (locationId: string) => void;
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
                key={location.id}
                onClick={() => onSelect(location.id)}
                className={`w-full rounded-md border p-3 flex items-start gap-4 cursor-pointer
                  ${
                    location.isSelected
                      ? "border-light-green bg-Secondary"
                      : "hover:bg-muted"
                  }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-Primary">{location.name}</p>
                  <p className="text-sm text-dark-gray mt-1">
                    {location.address}
                  </p>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(location.id);
                  }}
                  className="text-muted-foreground hover:text-Primary"
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