"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import LocationSelectDialog from "./location-select-dialog";
import AddEditLocationDialog from "./add-edit-location-dialog";

export type LocationType = "House" | "Office";

export type SavedLocation = {
  id: string;
  type: LocationType;
  name: string;
  districtId: string;
  districtName: string;
  thana: string;
  address: string;
  isSelected: boolean;
};

const DeliveryLocation = () => {
  const t = useTranslations("influencer.campaign-details");

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([
    {
      id: "1",
      type: "House",
      name: "House",
      districtId: "1",
      districtName: "Dhaka",
      thana: "Banani",
      address: "House 61, Road 8, Block F, Banani, Dhaka 1213",
      isSelected: true,
    },
    {
      id: "2",
      type: "Office",
      name: "Office",
      districtId: "1",
      districtName: "Dhaka",
      thana: "Gulshan",
      address: "Road No 7A, Banani, Dhaka 1213",
      isSelected: false,
    },
  ]);

  const [openSelect, setOpenSelect] = useState(false);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editingLocation, setEditingLocation] = useState<SavedLocation | null>(null);

  // Get currently selected location
  const selectedLocation = savedLocations.find(loc => loc.isSelected) || savedLocations[0];
  
  // Handle saving a new or edited location
  const handleSaveLocation = (locationData: Omit<SavedLocation, 'id' | 'isSelected'>) => {
    if (editingLocation) {
      // Update existing location
      setSavedLocations(prev => prev.map(loc => 
        loc.id === editingLocation.id 
          ? { ...loc, ...locationData, isSelected: loc.isSelected }
          : loc
      ));
    } else {
      // Add new location
      const newLocation: SavedLocation = {
        ...locationData,
        id: Date.now().toString(),
        isSelected: false,
      };
      setSavedLocations(prev => [...prev, newLocation]);
    }
  };

  // Handle location selection
  const handleSelectLocation = (locationId: string) => {
    setSavedLocations(prev => 
      prev.map(loc => ({
        ...loc,
        isSelected: loc.id === locationId
      }))
    );
    setOpenSelect(false);
  };

  // Handle editing a location
  const handleEditLocation = (locationId: string) => {
    const locationToEdit = savedLocations.find(loc => loc.id === locationId);
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

  return (
    <Card className="h-full shadow-md">
      <CardContent className="p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-Primary font-semibold">
          <MapPin size={22} />
          <h1>{t("Delivery Location")}</h1>
        </div>

        {/* Current location */}
        <div className="bg-linear-to-l from-bg-white to-Secondary p-4 rounded-md border border-light-green">
          <p className="text-light-green font-semibold">{selectedLocation.name}</p>
          <p className="text-sm text-dark-gray mt-1">
            {selectedLocation.address}
          </p>
        </div>

        {/* Select dialog */}
        <LocationSelectDialog
          open={openSelect}
          onOpenChange={setOpenSelect}
          savedLocations={savedLocations}
          onSelect={handleSelectLocation}
          onEdit={handleEditLocation}
          onAdd={handleAddLocation}
        />

        {/* Add / Edit dialog */}
        <AddEditLocationDialog
          open={openAddEdit}
          onOpenChange={setOpenAddEdit}
          editingLocation={editingLocation}
          onSave={handleSaveLocation}
        />
      </CardContent>
    </Card>
  );
};

export default DeliveryLocation;