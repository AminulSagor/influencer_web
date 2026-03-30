"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";

type Props = {
  imageUrl: string;
  brandName: string;
  isEditing: boolean;
  isSaving: boolean;
  onFileSelect: (file: File | null) => void;
  onRemove: () => void;
};

const ProfilePhotoSection = ({
  imageUrl,
  brandName,
  isEditing,
  isSaving,
  onFileSelect,
  onRemove,
}: Props) => {
  const t = useTranslations("brand.profile");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenFile = () => {
    if (!isEditing || isSaving) return;
    inputRef.current?.click();
  };

  return (
    <div className="flex min-w-[180px] flex-col items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
      />

      <div className="grid h-36 w-36 place-items-center overflow-hidden rounded-full border border-dashed border-light-green/60 bg-light-green/15">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={brandName || "Profile"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-light-green/20">
            <Upload className="h-5 w-5 text-Primary/70" />
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={!isEditing || isSaving}
        onClick={onRemove}
        className="h-7 rounded-full border-light-green/40 px-8 text-xs text-Primary hover:bg-light-green/10"
      >
        {t("photo.remove")}
      </Button>

      <Button
        type="button"
        disabled={!isEditing || isSaving}
        onClick={handleOpenFile}
        className="h-7 rounded-full bg-light-green px-8 text-xs text-white hover:bg-light-green/90"
      >
        {t("photo.upload")}
      </Button>
    </div>
  );
};

export default ProfilePhotoSection;