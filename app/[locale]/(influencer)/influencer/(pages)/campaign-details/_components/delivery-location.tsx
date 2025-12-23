"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";

/* ---------------- Radio ---------------- */
type RadioProps = {
  checked: boolean;
};

const Radio = ({ checked }: RadioProps) => (
  <div
    className={`h-5 w-5 rounded-full border flex items-center justify-center
      ${checked ? "border-light-green" : "border-gray-300"}`}
  >
    {checked && <div className="h-3 w-3 rounded-full bg-light-green" />}
  </div>
);

/* ---------------- Main Component ---------------- */
const DeliveryLocation = () => {
  const [location, setLocation] = useState<"House" | "Office">("House");
  const [openAddDialog, setOpenAddDialog] = useState(false);

  return (
    <Card className="h-full shadow-md">
      <CardContent className="p-4 flex h-full flex-col justify-between">
        {/* Header */}
        <div className="flex items-center gap-2 text-Primary font-semibold">
          <MapPin size={22} />
          <h1>Delivery Location</h1>
        </div>

        {/* Current location */}
        <div className="mt-4 bg-linear-to-l from-bg-white to-Secondary p-4 rounded-md border border-light-green">
          <p className="text-light-green font-semibold">{location}</p>
          <p className="text-sm text-dark-gray mt-1">
            {location === "House"
              ? "House 61, Road 8, Block F, Banani, Dhaka 1213"
              : "Road No 7A, Banani, Dhaka 1213"}
          </p>
        </div>

        {/* Change Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                className="mt-4 border-light-green text-Primary bg-linear-to-l from-bg-white to-Secondary"
              >
                Change
              </Button>
            </div>
          </DialogTrigger>

          <DialogContent className="p-0 max-w-sm">
            <Card>
              <CardHeader>
                <DialogTitle asChild>
                  <CardTitle className="flex items-center gap-2 text-Primary">
                    <MapPin size={20} />
                    Where to send the product?
                  </CardTitle>
                </DialogTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* -------- House -------- */}
                <button
                  onClick={() => setLocation("House")}
                  className={`w-full rounded-md border p-3 text-left transition
                    ${
                      location === "House"
                        ? "border-light-green bg-Secondary"
                        : "hover:bg-muted"
                    }`}
                >
                  <div className="flex items-start gap-5">
                    <Radio checked={location === "House"} />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-Primary">House</p>
                        <span className="text-xs bg-light-green/20 text-light-green px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      </div>
                      <p className="text-sm text-dark-gray mt-1">
                        House 61, Road 8, Block F, Banani, Dhaka 1213
                      </p>
                    </div>

                    {/* Edit icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAddDialog(true);
                      }}
                      className={`transition
      ${
        location === "House"
          ? "text-Primary"
          : "text-muted-foreground hover:text-Primary"
      }`}
                      aria-label="Edit house address"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </button>

                {/* -------- Office -------- */}
                <button
                  onClick={() => setLocation("Office")}
                  className={`w-full rounded-md border p-3 text-left transition
                    ${
                      location === "Office"
                        ? "border-light-green bg-Secondary"
                        : "hover:bg-muted"
                    }`}
                >
                  <div className="flex items-start gap-5">
                    <Radio checked={location === "Office"} />

                    <div className="flex-1">
                      <p className="font-medium text-Primary">Office</p>
                      <p className="text-sm text-dark-gray mt-1">
                        Road No 7A, Banani, Dhaka 1213
                      </p>
                    </div>

                    {/* Edit icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAddDialog(true);
                      }}
                      className={`transition
      ${
        location === "Office"
          ? "text-Primary"
          : "text-muted-foreground hover:text-Primary"
      }`}
                      aria-label="Edit office address"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </button>

                {/* -------- Add another -------- */}
                <button
                  onClick={() => setOpenAddDialog(true)}
                  className="w-full rounded-md border border-dashed border-light-green p-3 text-light-green hover:bg-Secondary transition"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus size={18} />
                    <span className="font-medium">Add another location</span>
                  </div>
                </button>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>

        {/* Add / Edit Location Dialog */}
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogContent className="p-0 overflow-hidden *:data-radix-dialog-close:hidden">
            {/* Accessibility-only title */}
            <VisuallyHidden>
              <DialogTitle>Add Address</DialogTitle>
            </VisuallyHidden>

            {/* Header */}
            <div className=" px-4 py-3 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-Primary font-semibold">
                  <MapPin size={18} />
                  <span>Address</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Close dialog */}
                  <DialogClose asChild>
                    <button
                      aria-label="Close dialog"
                      className="cursor-pointer text-Primary hover:opacity-70 transition bg-white z-50"
                    >
                      <X size={24} />
                    </button>
                  </DialogClose>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="text-xs bg-muted px-3 py-1 rounded-full text-Primary">
                  Set Default
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4 px-4 pb-4">
              {/* Give a name */}
              <div className="space-y-1">
                <label className="text-sm text-Primary font-medium">
                  Give A Name
                </label>
                <input
                  placeholder="Give A Name To The Address"
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:border-light-green"
                />
              </div>

              {/* Thana */}
              <div className="space-y-1">
                <label className="text-sm text-Primary font-medium">
                  Thana<span className="text-red-500">*</span>
                </label>
                <select className="w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:border-light-green">
                  <option>Select Thana</option>
                </select>
              </div>

              {/* Zilla */}
              <div className="space-y-1">
                <label className="text-sm text-Primary font-medium">
                  Zilla<span className="text-red-500">*</span>
                </label>
                <select className="w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:border-light-green">
                  <option>Select Zilla</option>
                </select>
              </div>

              {/* Full Address */}
              <div className="space-y-1">
                <label className="text-sm text-Primary font-medium">
                  Full Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter Full Address"
                  rows={3}
                  className="w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:border-light-green"
                />
              </div>

              {/* Save */}
              <div className="flex items-center justify-center px-2">
                <button
                  className="px-7 min-w-44 bg-light-green text-white rounded-md py-2 font-medium"
                  onClick={() => setOpenAddDialog(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DeliveryLocation;
