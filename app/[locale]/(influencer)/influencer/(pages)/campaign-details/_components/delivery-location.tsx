"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import LocationSelectDialog from "./location-select-dialog";
import AddEditLocationDialog from "./add-edit-location-dialog";
import { JobAddress, InfluencerAddress } from "@/types/influencer/job_types";
import { InfluencerJobService } from "@/service/influencer/job-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

const ITEMS_PER_PAGE = 3;

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
  const [page, setPage] = useState(0);

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
          fullAddress:
            addr.fullAddress ||
            [addr.street, addr.thana, addr.zilla].filter(Boolean).join(", "),
          isSelected: addr.isDefault || false,
          isDefault: addr.isDefault || false,
        })
      );

      if (deliveryAddress) {
        mapped.forEach((loc) => {
          loc.isSelected = loc.addressName === deliveryAddress.addressName;
        });
      }

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
    if (needSampleProduct && !deliveryAddress) {
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needSampleProduct, deliveryAddress?.addressName]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(savedLocations.length / ITEMS_PER_PAGE));
    if (page > totalPages - 1) {
      setPage(totalPages - 1);
    }
  }, [page, savedLocations.length]);

  const totalPages = Math.max(1, Math.ceil(savedLocations.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages - 1);
  const visibleLocations = useMemo(
    () =>
      savedLocations.slice(
        currentPage * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      ),
    [savedLocations, currentPage]
  );

  const handleSelectLocation = (addressName: string) => {
    setSavedLocations((prev) =>
      prev.map((loc) => ({
        ...loc,
        isSelected: loc.addressName === addressName,
      }))
    );
    setOpenSelect(false);
    const selected = savedLocations.find((loc) => loc.addressName === addressName);
    if (selected) {
      onAddressSelect?.(selected.id);
    }
  };

  const handleEditLocation = (addressName: string) => {
    const locationToEdit = savedLocations.find((loc) => loc.addressName === addressName);
    if (locationToEdit) {
      setEditingLocation(locationToEdit);
      setOpenAddEdit(true);
    }
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setOpenAddEdit(true);
  };

  const handleAddressCreated = () => {
    fetchAddresses();
  };

  return (
    <Card className="h-full gap-0 py-0 shadow-md">
      <CardHeader className="p-6 pb-3">
        <CardTitle className="flex items-center gap-2 text-Primary">
          <MapPin size={22} />
          {t("Delivery Location")}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-6 pt-0">
        {needSampleProduct ? (
          deliveryAddress ? (
            <div className="flex min-h-[88px] flex-col justify-center rounded-md border border-light-green bg-linear-to-l from-bg-white to-Secondary p-4">
              <p className="font-semibold text-Primary">
                {deliveryAddress.addressName}
              </p>
              <p className="mt-1 text-sm text-dark-gray">
                {deliveryAddress.fullAddress ||
                  [deliveryAddress.street, deliveryAddress.thana, deliveryAddress.zilla]
                    .filter(Boolean)
                    .join(", ")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {[deliveryAddress.thana, deliveryAddress.zilla].filter(Boolean).join(", ")}
              </p>
            </div>
          ) : loadingAddresses ? (
            <div className="space-y-2">
              <Skeleton className="h-[88px] w-full rounded-md" />
              <Skeleton className="h-[88px] w-full rounded-md" />
            </div>
          ) : savedLocations.length > 0 ? (
            <div className="space-y-3">
              {visibleLocations.map((location) => (
                <div
                  key={location.id || location.addressName}
                  className={`min-h-[88px] rounded-md border p-4 ${
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
                      <span className="rounded-full bg-light-green/10 px-2 py-0.5 text-xs font-medium text-light-green">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-dark-gray">
                    {location.fullAddress}
                  </p>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Show delivery location page ${index + 1}`}
                      onClick={() => setPage(index)}
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition-all",
                        index === currentPage
                          ? "w-5 bg-light-green"
                          : "bg-light-green/30 hover:bg-light-green/60"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No delivery address selected yet.
            </p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">
            No delivery required for this campaign.
          </p>
        )}

        {needSampleProduct && !deliveryAddress && (
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
