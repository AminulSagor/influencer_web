"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoCloseCircle } from "react-icons/io5";
import { BiSolidEdit } from "react-icons/bi";

import NIDUploadBack from "./nid-back-upload";
import NIDUploadFront from "./nid-front-upload";
import TinCertificateUpload from "./tin-certificate-upload";
import TradeLicenseUpload from "./trade-license-upload";
import type {
  AgencyProfileResponse,
  UpdateAgencyBinPayload,
  UpdateAgencyNidPayload,
  UpdateAgencyTinPayload,
  UpdateAgencyTradeLicensePayload,
} from "@/types/agency/account-settings";
import {
  updateAgencyBin,
  updateAgencyNid,
  updateAgencyTin,
  updateAgencyTradeLicense,
} from "@/service/agency/account-settings";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type VerificationMethodCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
  onProfileUpdated: (updatedProfile: AgencyProfileResponse) => void;
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

const VerificationMethodCard = ({
  profile,
  isLoading,
  onProfileUpdated,
}: VerificationMethodCardProps) => {
  const isVerified = !!profile?.isVerified;

  const [nidNumber, setNidNumber] = useState("");
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [binNumber, setBinNumber] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setNidNumber(profile?.nidNumber ?? "");
  }, [profile?.nidNumber]);

  useEffect(() => {
    setTradeLicenseNumber(profile?.tradeLicenseNumber ?? "");
  }, [profile?.tradeLicenseNumber]);

  useEffect(() => {
    setTinNumber(profile?.tinNumber ?? "");
  }, [profile?.tinNumber]);

  useEffect(() => {
    setBinNumber(profile?.binNumber ?? "");
  }, [profile?.binNumber]);

  const handleSaveAll = async () => {
    if (!profile) return;

    const nidPayload: UpdateAgencyNidPayload = {
      nidNumber: nidNumber.trim(),
      nidFrontImg: "",
      nidBackImg: "",
    };

    const tradeLicensePayload: UpdateAgencyTradeLicensePayload = {
      tradeLicenseNumber: tradeLicenseNumber.trim(),
      tradeLicenseImage: "",
    };

    const tinPayload: UpdateAgencyTinPayload = {
      tinNumber: tinNumber.trim(),
      tinImage: "",
    };

    const binPayload: UpdateAgencyBinPayload = {
      binNumber: binNumber.trim(),
    };

    try {
      setIsSaving(true);

      await updateAgencyNid(nidPayload);
      await updateAgencyTradeLicense(tradeLicensePayload);
      await updateAgencyTin(tinPayload);
      const finalUpdatedProfile = await updateAgencyBin(binPayload);

      onProfileUpdated(finalUpdatedProfile);
      setIsEditing(false);
      notifySuccess("Verification info updated successfully");
    } catch (error) {
      console.error("Failed to update verification info:", error);
      notifyError(
        getErrorMessage(error, "Failed to update verification info")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditOrSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    await handleSaveAll();
  };

  return (
    <Card>
      <div className="px-4 py-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-orange hover:no-underline">
              <div className="flex w-full items-center justify-between pr-2">
                <span>Verification Methods</span>

                {isEditing ? (
                  <Button
                    type="button"
                    size="sm"
                    className="cursor-pointer bg-light-green hover:bg-light-green/90"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void handleEditOrSave();
                    }}
                    disabled={isSaving || isLoading}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                ) : (
                  <button
                    type="button"
                    className="cursor-pointer text-gray-500"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void handleEditOrSave();
                    }}
                    disabled={isSaving || isLoading}
                  >
                    <BiSolidEdit size={20} />
                  </button>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4 px-1">
                {isVerified ? (
                  <div className="rounded-md border border-light-green-200 bg-light-green-100 p-2">
                    <p className="font-medium text-light-green-600">
                      Verification Completed
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border border-rose-200 bg-rose-100 p-2">
                    <p className="flex items-center gap-2 font-medium text-rose-600">
                      <IoCloseCircle size={18} />
                      Verification Required. Please provide documents
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 space-y-4 md:col-span-4">
                    <div className="space-y-2">
                      <Label className="text-orange">Your NID Number</Label>

                      <Input
                        placeholder="Enter your NID number"
                        value={isLoading ? "Loading..." : nidNumber}
                        onChange={(e) => setNidNumber(e.target.value)}
                        disabled={isSaving || isLoading || !isEditing}
                        readOnly={!isEditing}
                      />
                    </div>

                    <NIDUploadFront />
                    <NIDUploadBack />
                  </div>

                  <div className="col-span-12 space-y-4 md:col-span-4">
                    <div className="space-y-2">
                      <Label className="text-orange">
                        Your Trade License Number
                      </Label>

                      <Input
                        placeholder="Enter your Trade License number"
                        value={isLoading ? "Loading..." : tradeLicenseNumber}
                        onChange={(e) => setTradeLicenseNumber(e.target.value)}
                        disabled={isSaving || isLoading || !isEditing}
                        readOnly={!isEditing}
                      />
                    </div>

                    <TradeLicenseUpload />
                  </div>

                  <div className="col-span-12 space-y-4 md:col-span-4">
                    <div className="space-y-2">
                      <Label className="text-orange">Your TIN Number</Label>
                      <Input
                        placeholder="Enter your TIN number"
                        value={isLoading ? "Loading..." : tinNumber}
                        onChange={(e) => setTinNumber(e.target.value)}
                        disabled={isSaving || isLoading || !isEditing}
                        readOnly={!isEditing}
                      />
                    </div>

                    <TinCertificateUpload />

                    <div className="space-y-2">
                      <Label className="text-orange">Your BIN Number</Label>
                      <Input
                        placeholder="Enter your BIN number"
                        value={isLoading ? "Loading..." : binNumber}
                        onChange={(e) => setBinNumber(e.target.value)}
                        disabled={isSaving || isLoading || !isEditing}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default VerificationMethodCard;