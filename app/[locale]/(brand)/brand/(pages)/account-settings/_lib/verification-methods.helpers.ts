import { ZodIssue } from "zod";
import { BrandProfile } from "@/types/client/profile/profile";
import {
  ALLOWED_MIME_TYPES,
  IMAGE_MIME_TYPES,
  MAX_BYTES,
  MAX_MB,
} from "./verification-methods.constants";
import {
  FieldErrors,
  UploadErrors,
  UploadFieldKey,
  UploadItemState,
  VerificationFormState,
} from "@/types/client/profile/verification-methods.type";

export const isPdfUrl = (url: string) => {
  if (!url) return false;
  return url.toLowerCase().includes(".pdf");
};

export const isImageUrl = (url: string) => {
  if (!url) return false;
  return !isPdfUrl(url);
};

export const getPreviewUrlFromExistingUrl = (url: string) =>
  url && isImageUrl(url) ? url : "";

export const getFileNameFromUrl = (url: string) => {
  if (!url) return "";
  const cleanUrl = url.split("?")[0];
  return decodeURIComponent(cleanUrl.split("/").pop() || "");
};

export const normalizeText = (value: string) => value.trim();

export const validateFile = (file: File) => {
  if (file.size > MAX_BYTES) return `Max ${MAX_MB}MB allowed`;
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Only PNG, JPEG, PDF allowed";
  }
  return null;
};

export const mapProfileToForm = (
  profile: BrandProfile,
): VerificationFormState => ({
  nidNumber: profile.nidNumber || "",
  tradeLicenseNumber: profile.tradeLicenseNumber || "",
  tinNumber: profile.tinNumber || "",
  binNumber: profile.binNumber || "",
});

export const mapProfileToUploads = (
  profile: BrandProfile,
): Record<UploadFieldKey, UploadItemState> => ({
  nidFront: {
    file: null,
    existingUrl: profile.nidFrontImg || "",
    previewUrl: getPreviewUrlFromExistingUrl(profile.nidFrontImg || ""),
  },
  nidBack: {
    file: null,
    existingUrl: profile.nidBackImg || "",
    previewUrl: getPreviewUrlFromExistingUrl(profile.nidBackImg || ""),
  },
  tradeLicense: {
    file: null,
    existingUrl: profile.tradeLicenseImg || "",
    previewUrl: getPreviewUrlFromExistingUrl(profile.tradeLicenseImg || ""),
  },
  tinCertificate: {
    file: null,
    existingUrl: profile.tinImage || "",
    previewUrl: getPreviewUrlFromExistingUrl(profile.tinImage || ""),
  },
});

export const isUploadChanged = (
  current: UploadItemState,
  initial: UploadItemState,
) => !!current.file || current.existingUrl !== initial.existingUrl;

export const createPreviewUrl = (file: File) =>
  IMAGE_MIME_TYPES.includes(file.type) ? URL.createObjectURL(file) : "";

export const mapZodIssuesToErrors = (
  issues: ZodIssue[],
  uploadFieldMap: Partial<Record<string, UploadFieldKey>> = {},
) => {
  const nextFormErrors: FieldErrors = {};
  const nextUploadErrors: UploadErrors = {};

  issues.forEach((issue) => {
    const rawPath = issue.path[0];

    if (typeof rawPath !== "string") return;

    if (
      rawPath === "nidNumber" ||
      rawPath === "tradeLicenseNumber" ||
      rawPath === "tinNumber" ||
      rawPath === "binNumber"
    ) {
      if (!nextFormErrors[rawPath]) {
        nextFormErrors[rawPath] = issue.message;
      }
      return;
    }

    const uploadField = uploadFieldMap[rawPath];
    if (uploadField && !nextUploadErrors[uploadField]) {
      nextUploadErrors[uploadField] = issue.message;
    }
  });

  return {
    formErrors: nextFormErrors,
    uploadErrors: nextUploadErrors,
  };
};
