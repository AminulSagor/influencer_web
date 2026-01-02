"use client";

import DottedButton from "@/app/[locale]/(brand)/brand/_components/dotted-button";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Film, FileText, File, X, Album } from "lucide-react";
import React, { useState, useRef } from "react";

const Step5 = () => {
  const increaseStep = useCampaignStore((s) => s.increaseStep);
  const decreaseStep = useCampaignStore((s) => s.decreaseStep);
  const [upLoadAssets, setUploadAssets] = useState<File[]>([]);
  const [brandAssets, setBrandAssets] = useState<File[]>([]);

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

    if (type === "content") {
      setUploadAssets((prev) => [...prev, ...fileList]);
    } else {
      setBrandAssets((prev) => [...prev, ...fileList]);
    }

    // Reset input to allow selecting same file again
    event.target.value = "";
  };

  const handleRemove = (index: number, type: "content" | "brand") => {
    if (type === "content") {
      setUploadAssets((prev) => prev.filter((_, i) => i !== index));
    } else {
      setBrandAssets((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image")) return <Album size={20} />;
    if (file.type.startsWith("video")) return <Film size={20} />;
    if (file.type.includes("pdf")) return <FileText size={20} />;
    return <File size={20} />;
  };

  const getFileSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 rounded-xl shadow p-5 bg-white border">
      {/* LEFT: Content Assets */}
      <Card className="border-none shadow-none w-full">
        <CardHeader>
          <div className="flex gap-1.5 text-Primary font-semibold">
            <Download size={20} />
            <h2>Content Assets</h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {upLoadAssets.length > 0 ? (
            <div className="space-y-3">
              {upLoadAssets.map((asset, index) => {
                const ext = asset.name.split(".").pop()?.toUpperCase();

                return (
                  <div
                    key={index}
                    className="flex justify-between bg-gradient-to-r from-white to-light-green/30 items-center rounded-xl py-3 px-4 text-sm border-light-green border"
                  >
                    <div className="flex gap-3 items-center">
                      <span className="text-light-green">
                        {getFileIcon(asset)}
                      </span>

                      <div className="text-sm">
                        <p className="text-light-green">{asset.name}</p>
                        <p className="text-xs text-light-green">
                          {ext} - {getFileSize(asset.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(index, "content")}
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
          />

          <DottedButton onClick={() => handleUploadClick("content")}>
            Upload Another Asset
          </DottedButton>
        </CardContent>
      </Card>

      <div className="h-auto bg-light-gray w-1 border" />

      {/* RIGHT: Brand Assets */}
      <Card className="border-none shadow-none w-full">
        <CardHeader>
          <div className="flex gap-1.5 text-Primary font-semibold">
            <Download size={20} />
            <h2>Brand Assets</h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {brandAssets.length > 0 ? (
            <div className="space-y-3">
              {brandAssets.map((asset, index) => {
                const ext = asset.name.split(".").pop()?.toUpperCase();

                return (
                  <div
                    key={index}
                    className="flex justify-between bg-gradient-to-r from-white to-light-green/30 items-center rounded-xl py-3 px-4 text-sm border-light-green border"
                  >
                    <div className="flex gap-3 items-center">
                      <span className="text-light-green">
                        {getFileIcon(asset)}
                      </span>

                      <div className="text-sm">
                        <p className="text-light-green">{asset.name}</p>
                        <p className="text-xs text-light-green">
                          {ext} - {getFileSize(asset.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(index, "brand")}
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
          />

          <DottedButton onClick={() => handleUploadClick("brand")}>
            Upload Another Asset
          </DottedButton>

          <div className="flex justify-end mt-10">
            <div className="flex gap-4">
              <SecondaryButton onClick={() => decreaseStep()}>
                Previous
              </SecondaryButton>

              <PrimaryButton
                className="px-8"
                onClick={() => increaseStep()}
                type="submit"
              >
                Next
              </PrimaryButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step5;
