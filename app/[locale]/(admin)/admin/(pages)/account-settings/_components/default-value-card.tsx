"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updatePlatformFee } from "@/service/admin/settings/update-platform-fee";
import toast from "react-hot-toast";

type Props = {
  initialPlatformFee: string;
  initialVatTax: string;
};

const DefaultValueCard = ({ initialPlatformFee, initialVatTax }: Props) => {
  const [platformValue, setPlatformValue] = useState(initialPlatformFee);
  const [vatValue, setVatValue] = useState(initialVatTax);

  const [isEditingPlatform, setIsEditingPlatform] = useState(false);
  const [isEditingVat, setIsEditingVat] = useState(false);

  const [isUpdatingPlatform, setIsUpdatingPlatform] = useState(false);
  const [isUpdatingVat, setIsUpdatingVat] = useState(false);

  const handlePlatformClick = async () => {
    if (!isEditingPlatform) {
      setIsEditingPlatform(true);
      return;
    }

    try {
      setIsUpdatingPlatform(true);

      await updatePlatformFee({
        platformFee: Number(platformValue),
      });

      setIsEditingPlatform(false);
      toast.success("Platform fee updated");
    } catch (error) {
      toast.error("Failed to update platform fee");
    } finally {
      setIsUpdatingPlatform(false);
    }
  };

  const handleVatClick = async () => {
    if (!isEditingVat) {
      setIsEditingVat(true);
      return;
    }

    try {
      setIsUpdatingVat(true);

      await updatePlatformFee({
        vatTax: Number(vatValue),
      });

      setIsEditingVat(false);
      toast.success("VAT/TAX updated");
    } catch (error) {
      toast.error("Failed to update VAT/TAX");
    } finally {
      setIsUpdatingVat(false);
    }
  };

  return (
    <Card className="h-full rounded-[20px] border border-gray-200 bg-white shadow-sm">
      <CardContent className="flex h-full flex-col gap-8 p-6">
        <div>
          <h3 className="text-xl font-semibold leading-none text-Primary">
            Default Values
          </h3>
          <p className="mt-1 text-base text-[#B8B8B8]">
            Adjust default values for the platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <div className="space-y-3">
            <p className="text-base font-medium text-black">Platform Fee</p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={platformValue}
                  onChange={(e) => setPlatformValue(e.target.value)}
                  disabled={!isEditingPlatform || isUpdatingPlatform}
                  className="h-10 w-24 rounded-lg border-light-green bg-white pr-7 text-center text-sm text-black disabled:cursor-default disabled:opacity-100"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-black">
                  %
                </span>
              </div>
              <Button
                variant="lightGreen"
                onClick={handlePlatformClick}
                disabled={isUpdatingPlatform}
                className="h-10 min-w-24 rounded-lg"
              >
                {isUpdatingPlatform
                  ? "Updating..."
                  : isEditingPlatform
                  ? "Update"
                  : "Edit"}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-base font-medium text-black">VAT/TAX</p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={vatValue}
                  onChange={(e) => setVatValue(e.target.value)}
                  disabled={!isEditingVat || isUpdatingVat}
                  className="h-10 w-24 rounded-lg border-light-green bg-white pr-7 text-center text-sm text-black disabled:cursor-default disabled:opacity-100"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-black">
                  %
                </span>
              </div>
              <Button
                variant="lightGreen"
                onClick={handleVatClick}
                disabled={isUpdatingVat}
                className="h-10 min-w-24 rounded-lg"
              >
                {isUpdatingVat ? "Updating..." : isEditingVat ? "Update" : "Edit"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DefaultValueCard;
