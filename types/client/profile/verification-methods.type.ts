export type UploadFieldKey =
  | "nidFront"
  | "nidBack"
  | "tradeLicense"
  | "tinCertificate";

export type UploadItemState = {
  file: File | null;
  previewUrl: string;
  existingUrl: string;
};

export type VerificationFormState = {
  nidNumber: string;
  tradeLicenseNumber: string;
  tinNumber: string;
  binNumber: string;
};

export type FieldErrors = Partial<Record<keyof VerificationFormState, string>>;
export type UploadErrors = Partial<Record<UploadFieldKey, string>>;