"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updatePlatformFee } from "@/service/admin/settings/update-platform-fee";
import toast from "react-hot-toast";

type Props = {
  initialPlatformFee: string;
  initialVatTax: string;
};

const DefaultValueCard = ({
  initialPlatformFee,
  initialVatTax,
}: Props) => {
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
    } catch (error) {
      toast.error("Failed to update platform fee:");
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
    } catch (error) {
      toast.error("Failed to update VAT tax");
    } finally {
      setIsUpdatingVat(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Values</CardTitle>
        <CardDescription>
          Adjust default values for the platform
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={platformValue}
            onChange={(e) => setPlatformValue(e.target.value)}
            disabled={!isEditingPlatform || isUpdatingPlatform}
            placeholder="Platform default value"
          />
          <Button
            variant="lightGreen"
            onClick={handlePlatformClick}
            disabled={isUpdatingPlatform}
          >
            {isUpdatingPlatform
              ? "Updating..."
              : isEditingPlatform
              ? "Update"
              : "Edit"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={vatValue}
            onChange={(e) => setVatValue(e.target.value)}
            disabled={!isEditingVat || isUpdatingVat}
            placeholder="VAT value"
          />
          <Button
            variant="lightGreen"
            onClick={handleVatClick}
            disabled={isUpdatingVat}
          >
            {isUpdatingVat ? "Updating..." : isEditingVat ? "Update" : "Edit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DefaultValueCard;