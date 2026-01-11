"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { ArrowUp } from "lucide-react";

type Props<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
};

function FilePreview({ file }: { file?: File }) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  if (!url) return null;

  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden">
      <Image src={url} alt="preview" fill className="object-cover" />
    </div>
  );
}

export default function ImageUploader<T extends FieldValues>({
  label,
  name,
  control,
  rules,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        const file = (field.value as FileList | undefined)?.[0];

        return (
          <div className="space-y-2">
            {/* Label (keep same style like your screenshot context) */}
            <p className="text-light-green text-sm font-medium">{label}</p>

            <div className="relative">
              <input
                id={`${String(name)}-file`}
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                className="hidden"
                onChange={(e) => field.onChange(e.target.files)}
              />

              <label
                htmlFor={`${String(name)}-file`}
                className="relative w-full h-[120px] md:h-[130px] rounded-xl border border-dashed border-[#D4D4D4] bg-white flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden"
              >
                {/* Preview overlay (does not change layout) */}
                <FilePreview file={file} />

                {/* Center content (hidden when preview exists) */}
                <div
                  className={
                    file
                      ? "relative z-10 opacity-0"
                      : "relative z-10 flex flex-col items-center justify-center"
                  }
                >
                  <div className="w-11 h-11 rounded-full bg-[#E6E6E6] flex items-center justify-center">
                    <ArrowUp className="w-6 h-6 text-[#7A7A7A]" />
                  </div>

                  <p className="text-sm text-[#7A7A7A]">
                    PNG, JPEG, PDF (Max 2MB)
                  </p>
                </div>
              </label>
            </div>

            {/* Error */}
            {fieldState.error?.message ? (
              <p className="text-red-500 text-sm">{fieldState.error.message}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
