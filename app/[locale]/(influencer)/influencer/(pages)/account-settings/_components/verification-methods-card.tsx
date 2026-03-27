"use client";

import React from "react";
import {
  AlertTriangle,
  SquarePen,
  Upload,
  XCircle,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { updateNid } from "@/service/influencer/nid/nid_service";
import { InfluencerProfileData } from "@/types/influencer/account_setting/profile_type";
import { toast } from "sonner";

type UploadKey = "frontNid" | "backNid";

type UploadState = {
  file: File | null;
  previewUrl?: string;
};

const MAX_MB = 2;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,image/jpg,application/pdf,.png,.jpg,.jpeg,.pdf";

interface VerificationMethodsCardProps {
  profileData: InfluencerProfileData | null;
  loading: boolean;
  refreshProfile: () => void;
}

export default function VerificationMethodsCard({ profileData, loading, refreshProfile }: VerificationMethodsCardProps) {
  const [nidNumber, setNidNumber] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<
    Partial<Record<UploadKey, number>>
  >({});

  const [uploads, setUploads] = React.useState<Record<UploadKey, UploadState>>({
    frontNid: { file: null },
    backNid: { file: null },
  });

  const [errors, setErrors] = React.useState<
    Partial<Record<UploadKey, string>>
  >({});

  const { upload } = useFileUpload({
    module: "brandguru/influencer/docs",
    showToast: false,
  });

  // Sync nidNumber with profileData when it changes
  React.useEffect(() => {
    if (profileData?.nidNumber) {
      setNidNumber(profileData.nidNumber);
    }
  }, [profileData]);

  React.useEffect(() => {
    return () => {
      Object.values(uploads).forEach((u) => {
        if (u.previewUrl) URL.revokeObjectURL(u.previewUrl);
      });
    };
  }, []);

  const validateFile = (file: File) => {
    if (file.size > MAX_BYTES) return `Max ${MAX_MB}MB allowed`;
    const okTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!okTypes.includes(file.type)) return "Only PNG, JPG, PDF allowed";
    return null;
  };

  const setUpload = (key: UploadKey, file: File | null) => {
    setErrors((p) => ({ ...p, [key]: undefined }));

    if (!file) {
      setUploads((prev) => {
        const old = prev[key];
        if (old.previewUrl) URL.revokeObjectURL(old.previewUrl);
        return { ...prev, [key]: { file: null } };
      });
      return;
    }

    const err = validateFile(file);
    if (err) {
      setErrors((p) => ({ ...p, [key]: err }));
      return;
    }

    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

    setUploads((prev) => {
      const old = prev[key];
      if (old.previewUrl) URL.revokeObjectURL(old.previewUrl);
      return { ...prev, [key]: { file, previewUrl } };
    });
  };

  const openFileDialog = (key: UploadKey) => {
    const input = document.getElementById(`file-${key}`) as HTMLInputElement | null;
    input?.click();
  };

  const onDrop = (key: UploadKey) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) setUpload(key, file);
  };

  const handleSubmit = async () => {
    if (!nidNumber.trim()) {
      toast.error("Please enter your NID number");
      return;
    }

    if (!uploads.frontNid.file || !uploads.backNid.file) {
      toast.error("Please select both NID documents");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Uploading documents...");

    try {
      console.log("Uploading front NID:", uploads.frontNid.file.name);
      setUploadProgress({ frontNid: 0 });
      const frontResult = await upload(uploads.frontNid.file);
      if (!frontResult) throw new Error("Failed to upload front NID");
      console.log("Front NID uploaded:", frontResult.publicUrl);
      setUploadProgress((p) => ({ ...p, frontNid: 100 }));

      console.log("Uploading back NID:", uploads.backNid.file.name);
      setUploadProgress((p) => ({ ...p, backNid: 0 }));
      const backResult = await upload(uploads.backNid.file);
      if (!backResult) throw new Error("Failed to upload back NID");
      console.log("Back NID uploaded:", backResult.publicUrl);
      setUploadProgress((p) => ({ ...p, backNid: 100 }));

      toast.loading("Submitting verification...", { id: toastId });

      const payload = {
        nidNumber: nidNumber.trim(),
        nidFrontImg: frontResult.publicUrl,
        nidBackImg: backResult.publicUrl,
      };
      console.log("Submitting NID to backend:", payload);
      
      const response = await updateNid(payload);
      console.log("Backend response:", response);

      if (response.success) {
        toast.success(response.message || "NID submitted successfully", { id: toastId });
        setNidNumber("");
        setUploads({ frontNid: { file: null }, backNid: { file: null } });
        setUploadProgress({});
        // Refresh profile data to show updated NID status
        refreshProfile();
      } else {
        toast.error(response.message || "Failed to update NID", { id: toastId });
      }
    } catch (error) {
      console.error("Error submitting NID:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit NID verification";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
      setUploadProgress({});
    }
  };

  const nidStatus = profileData?.nidVerification?.nidStatus;
  const hasExistingNid = !!(profileData?.nidNumber && profileData?.nidFrontImg && profileData?.nidBackImg);
  const isNidLocked = nidStatus === "verified" || nidStatus === "approved" || nidStatus === "pending";
  const canResubmit = hasExistingNid && !isNidLocked;

  return (
    <Card className="py-0 relative">
      <CardContent className="py-4 px-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            <div className="relative">
              <AccordionTrigger className="py-0 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-16">
                  <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-base text-orange">
                      Verification Methods
                    </h1>
                    <SquarePen size={15} className="text-orange" />
                  </div>
                </div>
              </AccordionTrigger>
            </div>

            <AccordionContent className="pt-4 pb-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-orange" />
                </div>
              ) : (
                <>
                  {hasExistingNid && (
                    <div className={`flex items-center gap-2 text-sm rounded-lg px-4 py-2 mb-6 border ${
                      nidStatus === "verified" || nidStatus === "approved"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : nidStatus === "pending"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : nidStatus === "rejected"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-[#FDECEC] text-[#E74C3C] border-[#FAD2D2]"
                    }`}>
                      {nidStatus === "verified" || nidStatus === "approved" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Your NID has been verified</span>
                        </>
                      ) : nidStatus === "pending" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>NID verification is pending review</span>
                        </>
                      ) : nidStatus === "rejected" ? (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          <span>
                            NID verification was rejected
                            {profileData?.nidVerification?.nidRejectReason && 
                              `: ${profileData.nidVerification.nidRejectReason}`
                            }
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          <span>Verification Required. Please Provide Documents</span>
                        </>
                      )}
                    </div>
                  )}

                  {!hasExistingNid && (
                    <div className="flex items-center gap-2 bg-[#FDECEC] text-[#E74C3C] text-sm rounded-lg px-4 py-2 mb-6 border border-[#FAD2D2]">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Verification Required. Please Provide Documents</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-orange">
                        Your NID Number
                      </label>
                      <Input
                        value={nidNumber}
                        onChange={(e) => setNidNumber(e.target.value)}
                        placeholder="Enter your NID Number"
                        className="h-10 border-black/10 focus-visible:ring-1 focus-visible:ring-orange/30"
                        disabled={isNidLocked}
                      />
                      <p className="text-xs text-muted-foreground">
                        Must be 10, 13, or 17 digits
                      </p>
                    </div>

                    <UploadBoxUI
                      label="Front Side of NID"
                      state={uploads.frontNid}
                      error={errors.frontNid}
                      accept={ACCEPT}
                      inputId="file-frontNid"
                      onPick={() => openFileDialog("frontNid")}
                      onRemove={() => setUpload("frontNid", null)}
                      onDrop={onDrop("frontNid")}
                      onDragOver={(e) => e.preventDefault()}
                      onChange={(f) => setUpload("frontNid", f)}
                      isUploading={isSubmitting && uploadProgress.frontNid !== undefined}
                      progress={uploadProgress.frontNid}
                      existingImageUrl={profileData?.nidFrontImg}
                      disabled={isNidLocked}
                    />

                    <UploadBoxUI
                      label="Back Side of NID"
                      state={uploads.backNid}
                      error={errors.backNid}
                      accept={ACCEPT}
                      inputId="file-backNid"
                      onPick={() => openFileDialog("backNid")}
                      onRemove={() => setUpload("backNid", null)}
                      onDrop={onDrop("backNid")}
                      onDragOver={(e) => e.preventDefault()}
                      onChange={(f) => setUpload("backNid", f)}
                      isUploading={isSubmitting && uploadProgress.backNid !== undefined}
                      progress={uploadProgress.backNid}
                      existingImageUrl={profileData?.nidBackImg}
                      disabled={isNidLocked}
                    />
                  </div>

                  {(!hasExistingNid || canResubmit) && (
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleSubmit}
                        disabled={
                          isSubmitting || 
                          !nidNumber.trim() || 
                          !uploads.frontNid.file || 
                          !uploads.backNid.file
                        }
                        className="bg-orange hover:bg-orange/90 text-white px-8"
                      >
                        {isSubmitting ? "Processing..." : hasExistingNid ? "Resubmit for Verification" : "Submit for Verification"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function UploadBoxUI({
  label,
  state,
  error,
  accept,
  inputId,
  onPick,
  onRemove,
  onDrop,
  onDragOver,
  onChange,
  isUploading,
  progress,
  existingImageUrl,
  disabled,
}: {
  label: string;
  state: UploadState;
  error?: string;
  accept: string;
  inputId: string;
  onPick: () => void;
  onRemove: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onChange: (file: File | null) => void;
  isUploading?: boolean;
  progress?: number;
  existingImageUrl?: string | null;
  disabled?: boolean;
}) {
  const hasFile = !!state.file;
  const hasExisting = !!existingImageUrl;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-orange">{label}</p>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onPick}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) onPick();
        }}
        onDrop={disabled ? undefined : onDrop}
        onDragOver={disabled ? undefined : onDragOver}
        className={[
          "w-full rounded-lg border border-dashed",
          "bg-muted/30",
          "min-h-35",
          "flex items-center justify-center",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          "select-none",
          "transition",
          !disabled && "hover:bg-muted/40",
          "focus:outline-none focus:ring-2 focus:ring-orange/20",
          "border-black/10",
        ].join(" ")}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          disabled={disabled}
        />

        {!hasFile && !hasExisting ? (
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <div className="h-11 w-11 rounded-full bg-black/5 grid place-items-center">
              <Upload className="h-5 w-5 text-black/40" />
            </div>
            <p className="text-xs text-black/50">PNG, JPG, PDF (Max 2MB)</p>
          </div>
        ) : hasFile ? (
          <div className="w-full px-4 py-4">
            {isUploading ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="h-6 w-6 animate-spin text-orange" />
                <p className="text-xs text-black/60">
                  Uploading... {progress ? `${progress}%` : ""}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      ✓ Selected
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="truncate">{state.file?.name}</span>
                    </div>
                  </div>

                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                      }}
                      className="h-9 w-9 p-0 hover:bg-black/5"
                      aria-label="Remove file"
                      title="Remove"
                    >
                      <XCircle className="h-4 w-4 text-black/40" />
                    </Button>
                  )}
                </div>

                {state.previewUrl && (
                  <div className="mt-3 rounded-md overflow-hidden border border-black/10">
                    <img
                      src={state.previewUrl}
                      alt="Preview"
                      className="w-full h-28 object-cover"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ) : hasExisting ? (
          <div className="w-full px-4 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="mt-3 rounded-md overflow-hidden border border-black/10 w-full">
                <img
                  src={existingImageUrl}
                  alt="Existing NID"
                  className="w-full h-28 object-cover"
                />
              </div>
              <p className="text-sm font-medium text-green-600">
                ✓ Uploaded
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
