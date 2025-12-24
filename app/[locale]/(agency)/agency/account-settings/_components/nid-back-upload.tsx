"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { UploadCloud, FileText, X } from "lucide-react";

const MAX_SIZE = 2 * 1024 * 1024;

const NIDUploadBack = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE) {
      alert("File size must be under 2MB");
      return;
    }

    setFile(selected);

    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <Label className="text-orange">Back Side of NID</Label>

      <div className="relative group">
        <label
          htmlFor="nid-front"
          className="flex flex-col items-center justify-center gap-2 w-full h-44 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition overflow-hidden"
        >
          {/* Preview */}
          {preview ? (
            <Image
              src={preview}
              alt="NID Preview"
              fill
              className="object-cover rounded-lg"
            />
          ) : file && file.type === "application/pdf" ? (
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <FileText size={32} />
              <p className="text-sm truncate max-w-[90%]">{file.name}</p>
            </div>
          ) : (
            <>
              <UploadCloud className="text-gray-400" size={32} />
              <p className="text-sm text-gray-600 font-medium">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPEG, PDF (Max 2MB)</p>
            </>
          )}
        </label>

        {/* Remove Button (Hover) */}
        {file && (
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Input
        id="nid-front"
        type="file"
        accept="image/png,image/jpeg,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default NIDUploadBack;
