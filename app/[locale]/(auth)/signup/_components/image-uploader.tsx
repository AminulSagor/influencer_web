"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IoArrowUp } from "react-icons/io5";
import { useTranslations } from "next-intl";

type ImageUploaderProps = {
  label: string;
  name: "nidFront" | "nidBack" | "tradeLicenseFile" | "tinCertificate";
  control: any;
};

const ImageUploader = ({ label, name, control }: ImageUploaderProps) => {
  const t = useTranslations("Signup.step7");

  return (
    <FormField
      control={control}
      name={name}
      rules={{
        required: t("required"),
        validate: {
          fileSize: (files: FileList) =>
            !files || files[0]?.size <= 2 * 1024 * 1024 || t("fileSizeError"),
          fileType: (files: FileList) =>
            !files ||
            ["image/png", "image/jpeg", "application/pdf"].includes(
              files[0]?.type
            ) ||
            t("fileTypeError"),
        },
      }}
      render={({ field }) => (
        <FormItem className="mt-4">
          <FormLabel className="text-light-green">{label}</FormLabel>

          <FormControl>
            <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-light-green bg-[#F8F8F8] rounded-lg h-36 cursor-pointer hover:bg-[#f0f0e9] transition">
              <span className="bg-gray-400 p-3 rounded-full text-white">
                <IoArrowUp size={20} />
              </span>

              <p className="text-sm text-Primary">{t("uploadHint")}</p>

              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,application/pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
            </label>
          </FormControl>

          {/* Preview */}
          {field.value && field.value[0] && (
            <p className="text-sm text-green-600 mt-1">
              {t("selectedFile")} {field.value[0].name}
            </p>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUploader;
