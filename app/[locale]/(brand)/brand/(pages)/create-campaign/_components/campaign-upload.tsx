"use client";

import DottedButton from "@/app/[locale]/(brand)/brand/_components/dotted-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Film, FileText, File, X, Album } from "lucide-react";
import React, { useState, useRef } from "react";

const CampaignUpload = () => {
  const [upLoadAssets, setUploadAssets] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploadAssets((prev) => [...prev, ...Array.from(files)]);
  };

  const handleRemove = (index: number) => {
    setUploadAssets((prev) => prev.filter((_, i) => i !== index));
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
    <Card className="border-none">
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
                  className="flex justify-between bg-linear-to-r from-white to-light-green/30 items-center rounded-xl py-3 px-4 text-sm border-light-green border"
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
                    onClick={() => handleRemove(index)}
                    className="text-light-green hover:text-red-500 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-light-green text-center font-semibold">
            Upload your assets please!
          </p>
        )}

        <input
          type="file"
          ref={fileInputRef}
          hidden
          multiple
          onChange={handleFileSelect}
        />

        <DottedButton onClick={handleUploadClick}>
          Upload Another Asset
        </DottedButton>
      </CardContent>
    </Card>
  );
};

export default CampaignUpload;
