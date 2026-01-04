"use client";

import { useFormStore } from "@/app/[locale]/(brand)/brand/zustand-store/campaign-forms-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Film, FileText, File, Album } from "lucide-react";
import React from "react";

const ContentAssetsCard = () => {
  const stepFive = useFormStore((s) => s.stepFive);

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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex gap-1.5 text-Primary font-semibold">
          <Download size={20} />
          <h2>Content Assets</h2>
          <span className="text-sm text-gray-500 font-normal ml-2">
            ({stepFive.contentAssets.length} files)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-3">
          {stepFive.contentAssets.length > 0 ? (
            stepFive.contentAssets.map((asset, index) => {
              const ext = asset.name.split(".").pop()?.toUpperCase();
              return (
                <div
                  key={asset.id || index}
                  className="flex justify-between bg-linear-to-r from-white to-light-green/10 items-center rounded-xl py-3 px-4 text-sm border-light-green border"
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
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No content assets uploaded</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentAssetsCard;