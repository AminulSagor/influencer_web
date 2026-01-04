"use client";

import DottedButton from "@/app/[locale]/(brand)/brand/_components/dotted-button";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useFormStore } from "@/app/[locale]/(brand)/brand/zustand-store/campaign-forms-store";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Download,
  Film,
  FileText,
  File,
  X,
  Album,
  AlertCircle,
} from "lucide-react";
import React, { useState, useRef } from "react";

const Step5 = () => {
  const { decreaseStep, increaseStep } = useCampaignStore();
  const {
    stepFive,
    addContentAsset,
    addBrandAsset,
    removeContentAsset,
    removeBrandAsset,
  } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Separate refs for each section
  const contentFileInputRef = useRef<HTMLInputElement>(null);
  const brandFileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = (type: "content" | "brand") => {
    if (type === "content") {
      contentFileInputRef.current?.click();
    } else {
      brandFileInputRef.current?.click();
    }
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "content" | "brand"
  ) => {
    const files = event.target.files;
    if (!files) return;

    const fileList = Array.from(files);

    // Clear errors when files are selected
    if (type === "content" && errors.contentAssets) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.contentAssets;
        return newErrors;
      });
    } else if (type === "brand" && errors.brandAssets) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.brandAssets;
        return newErrors;
      });
    }

    // Add files to Zustand store
    fileList.forEach((file) => {
      if (type === "content") {
        addContentAsset(file);
      } else {
        addBrandAsset(file);
      }
    });

    // Reset input to allow selecting same file again
    event.target.value = "";
  };

  const handleRemove = (id: string, type: "content" | "brand") => {
    if (type === "content") {
      removeContentAsset(id);
    } else {
      removeBrandAsset(id);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image")) return <Album size={20} />;
    if (fileType.startsWith("video")) return <Film size={20} />;
    if (fileType.includes("pdf")) return <FileText size={20} />;
    return <File size={20} />;
  };

  const getFileSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepFive.contentAssets.length === 0) {
      newErrors.contentAssets = "Please upload at least one content asset";
    }

    if (stepFive.brandAssets.length === 0) {
      newErrors.brandAssets = "Please upload at least one brand asset";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      // Files are already stored in Zustand when uploaded
      // Now we can proceed to next step
      increaseStep();
    } else {
      // Show alert with specific errors
      const errorMessages = [];
      if (stepFive.contentAssets.length === 0) {
        errorMessages.push("Content Assets are required");
      }
      if (stepFive.brandAssets.length === 0) {
        errorMessages.push("Brand Assets are required");
      }

      // alert(`Please upload all required assets:\n${errorMessages.join("\n")}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Validation Error Display */}
      {Object.keys(errors).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold mb-2">
                  Please upload all required assets:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {errors.contentAssets && (
                    <li className="text-sm">Content Assets are required</li>
                  )}
                  {errors.brandAssets && (
                    <li className="text-sm">Brand Assets are required</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 rounded-xl shadow p-5 bg-white border">
        {/* LEFT: Content Assets */}
        <Card
          className={`border-none shadow-none w-full ${
            errors.contentAssets ? "border-red-500 border" : ""
          }`}
        >
          <CardHeader>
            <div className="flex gap-1.5 text-Primary font-semibold">
              <Download size={20} />
              <h2>Content Assets</h2>
            </div>
            {errors.contentAssets && (
              <p className="text-sm text-red-500 mt-1">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Required
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {stepFive.contentAssets.length > 0 ? (
              <div className="space-y-3">
                {stepFive.contentAssets.map((asset) => {
                  const ext = asset.name.split(".").pop()?.toUpperCase();

                  return (
                    <div
                      key={asset.id}
                      className="flex justify-between bg-lienear-to-r from-white to-light-green/30 items-center rounded-xl py-3 px-4 text-sm border-light-green border"
                    >
                      <div className="flex gap-3 items-center">
                        <span className="text-light-green">
                          {getFileIcon(asset.type)}
                        </span>

                        <div className="text-sm">
                          <p className="text-light-green">{asset.name}</p>
                          <p className="text-xs text-light-green">
                            {ext} - {getFileSize(asset.size)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(asset.id, "content")}
                        className="text-light-green hover:text-red-500 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-light-green text-center font-semibold py-4">
                Upload your assets please!
              </p>
            )}

            <input
              type="file"
              ref={contentFileInputRef}
              hidden
              multiple
              onChange={(e) => handleFileSelect(e, "content")}
              accept="image/*,video/*,.pdf,.doc,.docx"
            />

            <DottedButton onClick={() => handleUploadClick("content")}>
              {stepFive.contentAssets.length === 0
                ? "Upload Asset"
                : "Upload Another Asset"}
            </DottedButton>
          </CardContent>
        </Card>

        <div className="h-auto bg-light-gray w-1 border" />

        {/* RIGHT: Brand Assets */}
        <Card
          className={`border-none shadow-none w-full ${
            errors.brandAssets ? "border-red-500 border" : ""
          }`}
        >
          <CardHeader>
            <div className="flex gap-1.5 text-Primary font-semibold">
              <Download size={20} />
              <h2>Brand Assets</h2>
            </div>
            {errors.brandAssets && (
              <p className="text-sm text-red-500 mt-1">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Required
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {stepFive.brandAssets.length > 0 ? (
              <div className="space-y-3">
                {stepFive.brandAssets.map((asset) => {
                  const ext = asset.name.split(".").pop()?.toUpperCase();

                  return (
                    <div
                      key={asset.id}
                      className="flex justify-between bg-lienear-to-r from-white to-light-green/30 items-center rounded-xl py-3 px-4 text-sm border-light-green border"
                    >
                      <div className="flex gap-3 items-center">
                        <span className="text-light-green">
                          {getFileIcon(asset.type)}
                        </span>

                        <div className="text-sm">
                          <p className="text-light-green">{asset.name}</p>
                          <p className="text-xs text-light-green">
                            {ext} - {getFileSize(asset.size)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(asset.id, "brand")}
                        className="text-light-green hover:text-red-500 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-light-green text-center font-semibold py-4">
                Upload your Brand assets here!
              </p>
            )}

            <input
              type="file"
              ref={brandFileInputRef}
              hidden
              multiple
              onChange={(e) => handleFileSelect(e, "brand")}
              accept="image/*,video/*,.pdf,.doc,.docx"
            />

            <DottedButton onClick={() => handleUploadClick("brand")}>
              {stepFive.brandAssets.length === 0
                ? "Upload Asset"
                : "Upload Another Asset"}
            </DottedButton>

            <div className="flex justify-end mt-10">
              <div className="flex gap-4">
                <SecondaryButton onClick={() => decreaseStep()}>
                  Previous
                </SecondaryButton>

                <PrimaryButton
                  className="px-8"
                  onClick={handleNextStep}
                  type="button"
                >
                  Next
                </PrimaryButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Step5;
