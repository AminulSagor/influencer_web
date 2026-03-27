"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import LocationSelectDialog from "./location-select-dialog";
import AddEditLocationDialog from "./add-edit-location-dialog";
import { JobAddress, InfluencerAddress } from "@/types/influencer/job_types";
import { InfluencerJobService } from "@/service/influencer/job-service";
import { toast } from "sonner";

export type SavedLocation = {
  id: string;
  addressName: string;
  thana: string;
  zilla: string;
  fullAddress: string;
  isSelected: boolean;
  isDefault: boolean;
};

interface DeliveryLocationProps {
  deliveryAddress?: JobAddress | null;
  needSampleProduct?: boolean;
  onAddressSelect?: (addressId: string) => void;
}

const DeliveryLocation = ({
  deliveryAddress,
  needSampleProduct,
  onAddressSelect,
}: DeliveryLocationProps) => {
  const t = useTranslations("influencer.campaign-details");

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editingLocation, setEditingLocation] = useState<SavedLocation | null>(null);

  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await InfluencerJobService.getAddresses();
      const mapped: SavedLocation[] = (res.data || []).map(
        (addr: InfluencerAddress) => ({
          id: addr.id,
          addressName: addr.addressName,
          thana: addr.thana,
          zilla: addr.zilla,
          fullAddress: addr.fullAddress || `${addr.street || ""}, ${addr.thana}, ${addr.zilla}`,
          isSelected: addr.isDefault || false,
          isDefault: addr.isDefault || false,
        })
      );
      // If no address is marked as default, select the first one
      if (mapped.length > 0 && !mapped.some((loc) => loc.isSelected)) {
        mapped[0].isSelected = true;
      }
      setSavedLocations(mapped);
      const selected = mapped.find((loc) => loc.isSelected);
      if (selected && onAddressSelect) {
        onAddressSelect(selected.id);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load addresses"
      );
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (needSampleProduct) {
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needSampleProduct]);

  // Get currently selected location
  const selectedLocation =
    savedLocations.find((loc) => loc.isSelected) || savedLocations[0];

  // Handle location selection — only one selected at a time
  const handleSelectLocation = (addressName: string) => {
    setSavedLocations((prev) =>
      prev.map((loc) => ({
        ...loc,
        isSelected: loc.addressName === addressName,
      }))
    );
    setOpenSelect(false);
    // Pass the id back for the accept job API
    const selected = savedLocations.find((loc) => loc.addressName === addressName);
    if (selected) {
      onAddressSelect?.(selected.id);
    }
  };

  // Handle editing a location
  const handleEditLocation = (addressName: string) => {
    const locationToEdit = savedLocations.find((loc) => loc.addressName === addressName);
    if (locationToEdit) {
      setEditingLocation(locationToEdit);
      setOpenAddEdit(true);
    }
  };

  // Handle adding a new location
  const handleAddLocation = () => {
    setEditingLocation(null);
    setOpenAddEdit(true);
  };

  // After address saved, re-fetch
  const handleAddressCreated = () => {
    fetchAddresses();
  };

  return (
    <Card className="h-full shadow-md">
      <CardContent className="p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-Primary font-semibold">
          <MapPin size={22} />
          <h1>{t("Delivery Location")}</h1>
        </div>

        {/* Address list */}
        {needSampleProduct ? (
          loadingAddresses ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          ) : savedLocations.length > 0 ? (
            <div className="space-y-3">
              {savedLocations.map((location) => (
                <div
                  key={location.addressName}
                  className={`p-4 rounded-md border ${
                    location.isSelected
                      ? "border-light-green bg-linear-to-l from-bg-white to-Secondary"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold ${location.isSelected ? "text-light-green" : "text-Primary"}`}>
                      {location.addressName}
                    </p>
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
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No saved addresses. Please add a delivery address.
            </p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">
            No delivery required for this campaign.
          </p>
        )}

        {/* Show change/add dialogs when delivery is needed */}
        {needSampleProduct && (
          <>
            <LocationSelectDialog
              open={openSelect}
              onOpenChange={setOpenSelect}
              savedLocations={savedLocations}
              onSelect={handleSelectLocation}
              onEdit={handleEditLocation}
              onAdd={handleAddLocation}
            />

            <AddEditLocationDialog
              open={openAddEdit}
              onOpenChange={setOpenAddEdit}
              editingLocation={editingLocation}
              onSuccess={handleAddressCreated}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryLocation;
