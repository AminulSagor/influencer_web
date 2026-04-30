"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getAgencyDollarRate,
  getAgencyServiceFee,
  updateAgencyDollarRate,
  updateAgencyServiceFee,
} from "@/service/agency/account-settings";

type ServiceFeeCardProps = {
  isLoading: boolean;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const maybeError = error as {
    response?: {
      data?: {
        message?: string | string[];
        error?: string;
      };
    };
    message?: string;
  };

  const message = maybeError?.response?.data?.message;

  if (Array.isArray(message) && message.length > 0) {
    return message[0];
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  const responseError = maybeError?.response?.data?.error;
  if (typeof responseError === "string" && responseError.trim()) {
    return responseError;
  }

  if (typeof maybeError?.message === "string" && maybeError.message.trim()) {
    return maybeError.message;
  }

  return fallback;
};

const ServiceFeeCard = ({ isLoading }: ServiceFeeCardProps) => {
  const [dollarRate, setDollarRate] = useState<string>("");
  const [serviceFee, setServiceFee] = useState<string>("");


  const [isDollarRateLoading, setIsDollarRateLoading] = useState(true);
  const [isServiceFeeLoading, setIsServiceFeeLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDollarRate = async () => {
      try {
        setIsDollarRateLoading(true);
        const response = await getAgencyDollarRate();
        const value = response?.dollarRate;
        const formattedValue =
          value === null || value === undefined || value === 0 ? "" : String(value);

        setDollarRate(formattedValue);
      } catch (error) {
        console.error("Failed to load dollar rate:", error);
        setDollarRate("");
      } finally {
        setIsDollarRateLoading(false);
      }
    };

    fetchDollarRate();
  }, []);

  useEffect(() => {
    const fetchServiceFee = async () => {
      try {
        setIsServiceFeeLoading(true);
        const response = await getAgencyServiceFee();
        const value = response?.serviceFee?.trim?.() ?? "";

        setServiceFee(value);
      } catch (error) {
        console.error("Failed to load service fee:", error);
        setServiceFee("");
      } finally {
        setIsServiceFeeLoading(false);
      }
    };

    fetchServiceFee();
  }, []);

  const handleEditOrSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setIsSaving(true);

      await updateAgencyDollarRate({
        dollarRate: dollarRate.trim() === "" ? "" : Number(dollarRate),
      });

      await updateAgencyServiceFee({
        serviceFee: serviceFee.trim(),
      });

      const refreshedDollarRate = await getAgencyDollarRate();
      const refreshedServiceFee = await getAgencyServiceFee();

      const refreshedDollarRateValue =
        refreshedDollarRate?.dollarRate === null ||
          refreshedDollarRate?.dollarRate === undefined ||
          refreshedDollarRate?.dollarRate === 0
          ? ""
          : String(refreshedDollarRate.dollarRate);

      const refreshedServiceFeeValue =
        refreshedServiceFee?.serviceFee?.trim?.() ?? "";

      setDollarRate(refreshedDollarRateValue);

      setServiceFee(refreshedServiceFeeValue);

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update service fee and dollar rate:", error);
      alert(getErrorMessage(error, "Failed to update service fee and dollar rate"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="h-full">
      <div className="flex h-full min-h-[230px] flex-col px-4 py-4">
        <div className="mb-4 flex min-h-6 items-center justify-between gap-2 text-md font-semibold text-Primary">
          <p>Service Fee & Dollar Rate</p>
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1 px-1">
            <p className="text-light-green">
              Enter you Rate for each campaign spend
            </p>

            <Input
              placeholder="eg: 10%"
              className="text-center"
              value={
                isLoading || isServiceFeeLoading
                  ? "Loading..."
                  : serviceFee
              }
              onChange={(e) => setServiceFee(e.target.value)}
              readOnly={!isEditing}
              disabled={isLoading || isServiceFeeLoading || isSaving}
            />
          </div>

          <div className="space-y-1 px-1">
            <p className="text-light-green">Enter Default Dollar Rate</p>

            <Input
              placeholder="eg: 122 BDT"
              className="text-center"
              value={isDollarRateLoading ? "Loading..." : dollarRate}
              onChange={(e) => setDollarRate(e.target.value)}
              readOnly={!isEditing}
              disabled={isDollarRateLoading || isSaving}
            />
          </div>
        </div>

        <Button
          className="mt-auto w-full cursor-pointer bg-light-green"
          type="button"
          onClick={() => void handleEditOrSave()}
          disabled={
            isLoading ||
            isServiceFeeLoading ||
            isDollarRateLoading ||
            isSaving
          }
        >
          {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
        </Button>
      </div>
    </Card>
  );
};

export default ServiceFeeCard;
