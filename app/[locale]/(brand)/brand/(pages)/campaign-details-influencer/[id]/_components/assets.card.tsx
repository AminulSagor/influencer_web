"use client";

import CollapseCard from "@/app/[locale]/(brand)/brand/_components/collapse-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Film, FileText, File, Album } from "lucide-react";
import React from "react";

type AssetItem = {
  name: string;
  type: string;
  size: number;
};

const AssetsCard = () => {
  const upLoadAssets: AssetItem[] = [
    { name: "banner.jpg", type: "image/jpeg", size: 400000 },
    { name: "promo.mp4", type: "video/mp4", size: 2000000 },
    { name: "brochure.pdf", type: "application/pdf", size: 800000 },
  ];

  const getFileIcon = (file: AssetItem) => {
    if (file.type.startsWith("image")) return <Album size={20} />;
    if (file.type.startsWith("video")) return <Film size={20} />;
    if (file.type.includes("pdf")) return <FileText size={20} />;
    return <File size={20} />;
  };

  const getFileSize = (size: number) => {
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <CollapseCard title="Content Assets" icon={<Download size={20} />}>
      <div className="space-y-3">
        <div className="space-y-3">
          {upLoadAssets.map((asset, index) => {
            const ext = asset.name.split(".").pop()?.toUpperCase();
            return (
              <div
                key={index}
                className="flex justify-between bg-linear-to-r from-white to-light-green/30 items-center rounded-xl py-3 px-4 text-sm border-light-green border"
              >
                <div className="flex gap-3 items-center">
                  <span className="text-light-green">{getFileIcon(asset)}</span>
                  <div className="text-sm">
                    <p className="text-light-green">{asset.name}</p>
                    <p className="text-xs text-light-green">
                      {ext} - {getFileSize(asset.size)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CollapseCard>
  );
};

export default AssetsCard;
