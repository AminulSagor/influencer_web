import {
  UploadItemState,
  VerificationFormState,
} from "@/types/client/profile/verification-methods.type";

export const MAX_MB = 2;
export const MAX_BYTES = MAX_MB * 1024 * 1024;
export const ACCEPT = "image/png,image/jpeg,application/pdf";

export const IMAGE_MIME_TYPES = ["image/png", "image/jpeg"];
export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];

export const DEFAULT_FORM: VerificationFormState = {
  nidNumber: "",
  tradeLicenseNumber: "",
  tinNumber: "",
  binNumber: "",
};

export const EMPTY_UPLOAD_STATE: UploadItemState = {
  file: null,
  previewUrl: "",
  existingUrl: "",
};
