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

const DefaultValueCard = () => {
  // State for platform default value
  const [platformValue, setPlatformValue] = useState("2%");
  const [isEditingPlatform, setIsEditingPlatform] = useState(false);

  // State for VAT value
  const [vatValue, setVatValue] = useState("15%");
  const [isEditingVat, setIsEditingVat] = useState(false);

  const handlePlatformClick = () => {
    if (isEditingPlatform) {
      setIsEditingPlatform(false);
    } else {
      setIsEditingPlatform(true);
    }
  };

  const handleVatClick = () => {
    if (isEditingVat) {
      setIsEditingVat(false);
    } else {
      setIsEditingVat(true);
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
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Input
            value={platformValue}
            onChange={(e) => setPlatformValue(e.target.value)}
            disabled={!isEditingPlatform}
            placeholder="Platform default value"
          />
          <Button variant={"lightGreen"} onClick={handlePlatformClick}>
            {isEditingPlatform ? "Update" : "Edit"}
          </Button>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Input
            value={vatValue}
            onChange={(e) => setVatValue(e.target.value)}
            disabled={!isEditingVat}
            placeholder="VAT value"
          />
          <Button variant={"lightGreen"} onClick={handleVatClick}>
            {isEditingVat ? "Update" : "Edit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DefaultValueCard;
