"use client";

import { useEffect, useMemo, useState } from "react";
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
import { uploadFile } from "@/service/common/upload/upload-file";

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

const isApprovedStatus = (status?: string) => {
  const normalized = status?.trim().toLowerCase();
  return normalized === "approved" || normalized === "verified";
};

const VerificationMethodCard = ({
  profile,
  isLoading,
  onProfileUpdated,
}: VerificationMethodCardProps) => {
  const [nidNumber, setNidNumber] = useState("");
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [binNumber, setBinNumber] = useState("");

  const [nidFrontFile, setNidFrontFile] = useState<File | null>(null);
  const [nidBackFile, setNidBackFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [tinFile, setTinFile] = useState<File | null>(null);

  const [isNidFrontRemoved, setIsNidFrontRemoved] = useState(false);
  const [isNidBackRemoved, setIsNidBackRemoved] = useState(false);
  const [isTradeLicenseRemoved, setIsTradeLicenseRemoved] = useState(false);
  const [isTinRemoved, setIsTinRemoved] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const hasAllVerificationFields =
    !!nidNumber.trim() &&
    !!tradeLicenseNumber.trim() &&
    !!tinNumber.trim() &&
    !!binNumber.trim() &&
    !!(nidFrontFile || (!isNidFrontRemoved && profile?.nidFrontImg)) &&
    !!(nidBackFile || (!isNidBackRemoved && profile?.nidBackImg)) &&
    !!(tradeLicenseFile ||
      (!isTradeLicenseRemoved && profile?.tradeLicenseImage)) &&
    !!(tinFile || (!isTinRemoved && profile?.tinImage));

  const isVerificationCompleted =
    hasAllVerificationFields &&
    isApprovedStatus(profile?.nidVerification?.nidStatus) &&
    isApprovedStatus(profile?.tradeLicenseVerification?.tradeLicenseStatus) &&
    isApprovedStatus(profile?.tinVerification?.tinStatus) &&
    isApprovedStatus(profile?.binVerification?.binStatus) &&
    !!profile?.isEmailVerified;

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

  useEffect(() => {
    setIsNidFrontRemoved(false);
    setIsNidBackRemoved(false);
    setIsTradeLicenseRemoved(false);
    setIsTinRemoved(false);
  }, [
    profile?.nidFrontImg,
    profile?.nidBackImg,
    profile?.tradeLicenseImage,
    profile?.tinImage,
  ]);

  const initialValues = useMemo(
    () => ({
      nidNumber: profile?.nidNumber ?? "",
      tradeLicenseNumber: profile?.tradeLicenseNumber ?? "",
      tinNumber: profile?.tinNumber ?? "",
      binNumber: profile?.binNumber ?? "",
      nidFrontImg: profile?.nidFrontImg ?? "",
      nidBackImg: profile?.nidBackImg ?? "",
      tradeLicenseImage: profile?.tradeLicenseImage ?? "",
      tinImage: profile?.tinImage ?? "",
    }),
    [profile]
  );

  const resetLocalFiles = () => {
    setNidFrontFile(null);
    setNidBackFile(null);
    setTradeLicenseFile(null);
    setTinFile(null);
    setIsNidFrontRemoved(false);
    setIsNidBackRemoved(false);
    setIsTradeLicenseRemoved(false);
    setIsTinRemoved(false);
  };

  const handleSaveAll = async () => {
    if (!profile) return;

    const isNidChanged =
      nidNumber.trim() !== initialValues.nidNumber ||
      !!nidFrontFile ||
      !!nidBackFile ||
      isNidFrontRemoved ||
      isNidBackRemoved;

    const isTradeLicenseChanged =
      tradeLicenseNumber.trim() !== initialValues.tradeLicenseNumber ||
      !!tradeLicenseFile ||
      isTradeLicenseRemoved;

    const isTinChanged =
      tinNumber.trim() !== initialValues.tinNumber ||
      !!tinFile ||
      isTinRemoved;

    const isBinChanged = binNumber.trim() !== initialValues.binNumber;

    if (
      !isNidChanged &&
      !isTradeLicenseChanged &&
      !isTinChanged &&
      !isBinChanged
    ) {
      setIsEditing(false);
      notifySuccess("No changes to save");
      return;
    }

    try {
      setIsSaving(true);

      const [
        uploadedNidFrontUrl,
        uploadedNidBackUrl,
        uploadedTradeLicenseUrl,
        uploadedTinUrl,
      ] = await Promise.all([
        nidFrontFile ? uploadFile(nidFrontFile) : Promise.resolve(null),
        nidBackFile ? uploadFile(nidBackFile) : Promise.resolve(null),
        tradeLicenseFile ? uploadFile(tradeLicenseFile) : Promise.resolve(null),
        tinFile ? uploadFile(tinFile) : Promise.resolve(null),
      ]);

      let latestProfile = profile;

      if (isNidChanged) {
        const nidPayload: UpdateAgencyNidPayload = {
          nidNumber: nidNumber.trim(),
          nidFrontImg: isNidFrontRemoved
            ? ""
            : uploadedNidFrontUrl ?? initialValues.nidFrontImg,
          nidBackImg: isNidBackRemoved
            ? ""
            : uploadedNidBackUrl ?? initialValues.nidBackImg,
        };

        latestProfile = await updateAgencyNid(nidPayload);
      }

      if (isTradeLicenseChanged) {
        const tradeLicensePayload: UpdateAgencyTradeLicensePayload = {
          tradeLicenseNumber: tradeLicenseNumber.trim(),
          tradeLicenseImage: isTradeLicenseRemoved
            ? ""
            : uploadedTradeLicenseUrl ?? initialValues.tradeLicenseImage,
        };

        latestProfile = await updateAgencyTradeLicense(tradeLicensePayload);
      }

      if (isTinChanged) {
        const tinPayload: UpdateAgencyTinPayload = {
          tinNumber: tinNumber.trim(),
          tinImage: isTinRemoved
            ? ""
            : uploadedTinUrl ?? initialValues.tinImage,
        };

        latestProfile = await updateAgencyTin(tinPayload);
      }

      if (isBinChanged) {
        const binPayload: UpdateAgencyBinPayload = {
          binNumber: binNumber.trim(),
        };

        latestProfile = await updateAgencyBin(binPayload);
      }

      onProfileUpdated({
        ...profile,
        ...latestProfile,
      });

      resetLocalFiles();
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

  const handleCancelEdit = () => {
    if (!profile) return;

    setNidNumber(profile.nidNumber ?? "");
    setTradeLicenseNumber(profile.tradeLicenseNumber ?? "");
    setTinNumber(profile.tinNumber ?? "");
    setBinNumber(profile.binNumber ?? "");
    resetLocalFiles();
    setIsEditing(false);
  };

  const isFieldDisabled = isSaving || isLoading || !isEditing;

  return (
    <Card>
      <div className="px-4 py-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-orange hover:no-underline">
              <div className="flex w-full items-center justify-between pr-2">
                <span>Verification Methods</span>

                <div
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {isEditing && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={handleCancelEdit}
                      disabled={isSaving || isLoading}
                    >
                      Cancel
                    </Button>
                  )}

                  {isEditing ? (
                    <Button
                      type="button"
                      size="sm"
                      className="cursor-pointer bg-light-green hover:bg-light-green/90"
                      onClick={() => {
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
                      onClick={() => {
                        void handleEditOrSave();
                      }}
                      disabled={isSaving || isLoading}
                    >
                      <BiSolidEdit size={20} />
                    </button>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4 px-1">
                {isVerificationCompleted ? (
                  <div className="rounded-md border border-light-green-200 bg-light-green-100 p-2">
                    <p className="font-medium text-light-green-600">
                      Verification Completed
                    </p>
                  </div>
                ) : hasAllVerificationFields ? (
                  <div className="rounded-md border border-orange/20 bg-orange/10 p-2">
                    <p className="flex items-center gap-2 font-medium text-orange">
                      <IoCloseCircle size={18} />
                      Verification in progress. Your submitted documents are under
                      review.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border border-rose-200 bg-rose-100 p-2">
                    <p className="flex items-center gap-2 font-medium text-rose-600">
                      <IoCloseCircle size={18} />
                      Verification required. Please provide all required documents
                      and information.
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
                        disabled={isFieldDisabled}
                        readOnly={!isEditing}
                      />
                    </div>

                    <NIDUploadFront
                      value={isNidFrontRemoved ? "" : profile?.nidFrontImg}
                      disabled={isFieldDisabled}
                      onChange={(file) => {
                        setIsNidFrontRemoved(false);
                        setNidFrontFile(file);
                      }}
                      onRemove={() => {
                        setIsNidFrontRemoved(true);
                        setNidFrontFile(null);
                      }}
                    />

                    <NIDUploadBack
                      value={isNidBackRemoved ? "" : profile?.nidBackImg}
                      disabled={isFieldDisabled}
                      onChange={(file) => {
                        setIsNidBackRemoved(false);
                        setNidBackFile(file);
                      }}
                      onRemove={() => {
                        setIsNidBackRemoved(true);
                        setNidBackFile(null);
                      }}
                    />
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
                        disabled={isFieldDisabled}
                        readOnly={!isEditing}
                      />
                    </div>

                    <TradeLicenseUpload
                      value={
                        isTradeLicenseRemoved ? "" : profile?.tradeLicenseImage
                      }
                      disabled={isFieldDisabled}
                      onChange={(file) => {
                        setIsTradeLicenseRemoved(false);
                        setTradeLicenseFile(file);
                      }}
                      onRemove={() => {
                        setIsTradeLicenseRemoved(true);
                        setTradeLicenseFile(null);
                      }}
                    />
                  </div>

                  <div className="col-span-12 space-y-4 md:col-span-4">
                    <div className="space-y-2">
                      <Label className="text-orange">Your TIN Number</Label>
                      <Input
                        placeholder="Enter your TIN number"
                        value={isLoading ? "Loading..." : tinNumber}
                        onChange={(e) => setTinNumber(e.target.value)}
                        disabled={isFieldDisabled}
                        readOnly={!isEditing}
                      />
                    </div>

                    <TinCertificateUpload
                      value={isTinRemoved ? "" : profile?.tinImage}
                      disabled={isFieldDisabled}
                      onChange={(file) => {
                        setIsTinRemoved(false);
                        setTinFile(file);
                      }}
                      onRemove={() => {
                        setIsTinRemoved(true);
                        setTinFile(null);
                      }}
                    />

                    <div className="space-y-2">
                      <Label className="text-orange">Your BIN Number</Label>
                      <Input
                        placeholder="Enter your BIN number"
                        value={isLoading ? "Loading..." : binNumber}
                        onChange={(e) => setBinNumber(e.target.value)}
                        disabled={isFieldDisabled}
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