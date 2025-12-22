"use client";

import { Upload, FileText, X } from "lucide-react";
import Image from "next/image";
import { useRef, useMemo } from "react";

type Props = {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
};

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export default function UploadBox({ label, file, onFileChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ derived value (NO state, NO effect)
  const previewUrl = useMemo(() => {
    if (file && file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE) {
      alert("File size must be under 2MB");
      return;
    }

    onFileChange(selected);
  };

  return (
    <div>
      <label className="text-sm font-medium text-[#E67E22]">
        {label}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        className="relative mt-1 flex flex-col items-center justify-center gap-2 h-[120px] rounded-lg border border-dashed border-gray-300 text-center cursor-pointer hover:bg-gray-50 transition"
      >
        {/* Empty */}
        {!file && (
          <>
            <Upload className="w-6 h-6 text-gray-400" />
            <p className="text-xs text-gray-500">
              PNG, JPEG, PDF (Max 2MB)
            </p>
          </>
        )}

        {/* Selected */}
        {file && (
          <>
            {previewUrl ? (
              <div className="relative w-24 h-16">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain rounded"
                  unoptimized
                />
              </div>
            ) : (
              <FileText className="w-8 h-8 text-gray-500" />
            )}

            <p className="text-xs text-gray-600 truncate max-w-[90%]">
              {file.name}
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
