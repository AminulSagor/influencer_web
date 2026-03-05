"use client";

import DottedButton from "@/app/[locale]/(brand)/brand/_components/dotted-button";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Film, FileText, File, X, Album, AlertCircle, Trash } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import axios from "axios";
import Loader from "@/components/spin-loader";
import { Input } from "@/components/ui/input";
import { AssetCategory, LocalAsset } from "@/app/[locale]/(brand)/brand/types/client-types";
import { notifyError } from "@/utils/toast_util";
import { submitCampaignStepFive } from "@/service/campaign/update-step-5";

const StepFive = () => {
  const { decreaseStep, increaseStep, campaignType, campaignId } = useCampaignStore();

  const [enabled, setEnabled] = useState<boolean>(false);
  const [contentAssets, setContentAssets] = useState<LocalAsset[]>([]);
  const [brandAssets, setBrandAssets] = useState<LocalAsset[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const contentFileInputRef = useRef<HTMLInputElement>(null);
  const brandFileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = (type: AssetCategory) => {
    if (type === "content") contentFileInputRef.current?.click();
    else brandFileInputRef.current?.click();
  };

  const makeId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: AssetCategory) => {
    const files = event.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    if (type === "content") clearError("contentAssets");
    if (type === "brand") clearError("brandAssets");

    const mapped: LocalAsset[] = fileList.map((file) => ({
      id: makeId(),
      file,
      category: type,
      description: "",
    }));

    if (type === "content") setContentAssets((prev) => [...prev, ...mapped]);
    else setBrandAssets((prev) => [...prev, ...mapped]);

    event.target.value = "";
  };

  const handleRemove = (id: string, type: AssetCategory) => {
    if (type === "content") setContentAssets((prev) => prev.filter((a) => a.id !== id));
    else setBrandAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const updateDescription = (id: string, type: AssetCategory, description: string) => {
    if (type === "content") {
      setContentAssets((prev) => prev.map((a) => (a.id === id ? { ...a, description } : a)));
    } else {
      setBrandAssets((prev) => prev.map((a) => (a.id === id ? { ...a, description } : a)));
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image")) return <Album size={20} />;
    if (fileType.startsWith("video")) return <Film size={20} />;
    if (fileType.includes("pdf")) return <FileText size={20} />;
    return <File size={20} />;
  };

  const getFileSize = (size: number) => (size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`);

  const shouldRequireBrand = campaignType === "paid_ad";

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (contentAssets.length === 0) newErrors.contentAssets = "Please upload at least one content asset";
    if (shouldRequireBrand && brandAssets.length === 0) newErrors.brandAssets = "Please upload at least one brand asset";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Upload files to server via Signed URL ---
  const uploadFileToServer = async (file: File): Promise<{ fileUrl: string }> => {
    // Replace with your actual signed URL logic if needed
    // For now, just return a mock public URL
    return { fileUrl: URL.createObjectURL(file) };
  };

  const buildAssetsPayload = async () => {
    const all = [...contentAssets, ...brandAssets];

    const uploads = await Promise.all(
      all.map(async (asset) => {
        const { fileUrl } = await uploadFileToServer(asset.file);
        return {
          fileName: asset.file.name,
          fileUrl,
          assetType: asset.file.type || "application/octet-stream",
          category: asset.category,
          fileSize: asset.file.size,
          mimeType: asset.file.type || "application/octet-stream",
          description: asset.description?.trim() || "",
        };
      })
    );

    return uploads;
  };

  const handleNextStep = async () => {
    if (!validateStep()) return;
    setLoading(true);

    try {
      const assets = await buildAssetsPayload();

      const payload = {
        needSampleProduct: Boolean(enabled),
        assets,
      };

      // ✅ service call to submit Step 5
      const res = await submitCampaignStepFive(campaignId, payload);

      if (res.success) {
        increaseStep();
      } else {
        notifyError(res.message || "Failed to save assets");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message || "Something went wrong. Please try again.";
        notifyError(message);
      } else {
        notifyError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const allErrorsCount = useMemo(() => Object.keys(errors).length, [errors]);

  return (
    <div className="space-y-4">
      {allErrorsCount > 0 && (
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

      <div className="rounded-xl shadow p-5 bg-white space-y-6 border">
        <div
          className={`${
            campaignType === "paid_ad"
              ? "flex flex-col lg:flex-row gap-4 lg:gap-8 "
              : "w-full"
          }`}
        >
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
              {contentAssets.length > 0 ? (
                <div className="space-y-3">
                  {contentAssets.map((asset) => {
                    const ext = asset.file.name.split(".").pop()?.toUpperCase();

                    return (
                      <div key={asset.id} className="space-y-2">
                        <div className="flex justify-between bg-lienear-to-r from-white to-light-green/30 items-center rounded-xl py-3 px-4 text-sm border-light-green border">
                          <div className="flex gap-3 items-center">
                            <span className="text-light-green">
                              {getFileIcon(asset.file.type)}
                            </span>

                            <div className="text-sm">
                              <p className="text-light-green">
                                {asset.file.name}
                              </p>
                              <p className="text-xs text-light-green">
                                {ext} - {getFileSize(asset.file.size)}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemove(asset.id, "content")}
                            className="text-light-green hover:text-red-500 cursor-pointer"
                            type="button"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <Input
                          value={asset.description}
                          onChange={(e) =>
                            updateDescription(
                              asset.id,
                              "content",
                              e.target.value
                            )
                          }
                          placeholder="Description (optional)"
                          className="w-full focus-visible:ring-1"
                        />
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
                {contentAssets.length === 0
                  ? "Upload Asset"
                  : "Upload Another Asset"}
              </DottedButton>
            </CardContent>
          </Card>

          {campaignType === "paid_ad" && (
            <>
              <div className="h-auto bg-light-gray w-1 border" />

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
                  {brandAssets.length > 0 ? (
                    <div className="space-y-3">
                      {brandAssets.map((asset) => {
                        const ext = asset.file.name
                          .split(".")
                          .pop()
                          ?.toUpperCase();

                        return (
                          <div key={asset.id} className="space-y-2">
                            <div className="flex justify-between bg-lienear-to-r from-white to-light-green/30 items-center rounded-xl py-3 px-4 text-sm border-light-green border">
                              <div className="flex gap-3 items-center">
                                <span className="text-light-green">
                                  {getFileIcon(asset.file.type)}
                                </span>

                                <div className="text-sm">
                                  <p className="text-light-green">
                                    {asset.file.name}
                                  </p>
                                  <p className="text-xs text-light-green">
                                    {ext} - {getFileSize(asset.file.size)}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => handleRemove(asset.id, "brand")}
                                className="text-light-green hover:text-red-500 cursor-pointer"
                                type="button"
                              >
                                <X size={18} />
                              </button>
                            </div>

                            <Input
                              value={asset.description}
                              onChange={(e) =>
                                updateDescription(
                                  asset.id,
                                  "brand",
                                  e.target.value
                                )
                              }
                              placeholder="Description (optional)"
                              className="w-full focus-visible:ring-1"
                            />
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
                    {brandAssets.length === 0
                      ? "Upload Asset"
                      : "Upload Another Asset"}
                  </DottedButton>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start">
          {campaignType === "influencer_promotion" && (
            <div className="space-y-3.5">
              <div className="flex gap-2 text-Primary items-center font-semibold">
                <span>
                  <Trash size={16} />
                </span>
                <p>Do you need to send sample?</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-light-green text-xs">
                  Need To Send Sample
                </span>

                <button
                  onClick={() => setEnabled(!enabled)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    enabled ? "bg-light-green" : "bg-light-gray"
                  }`}
                  type="button"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      enabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          <div
            className={`flex justify-end ${
              campaignType === "influencer_promotion"
                ? "w-full md:w-auto"
                : "w-full"
            } mt-6`}
          >
            <div className="flex gap-4">
              <SecondaryButton onClick={() => decreaseStep()}>
                Previous
              </SecondaryButton>

              <PrimaryButton
                className="px-8"
                onClick={handleNextStep}
                type="button"
                disabled={loading}
              >
                {loading ? <Loader className="h-4 w-4" /> : "Next"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFive;
