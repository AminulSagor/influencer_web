/**
 * File Upload Hook
 * 
 * @example
 * const { upload, isUploading, progress } = useFileUpload({
 *   module: "brandguru/agency/docs",
 *   onSuccess: (result) => console.log(result.publicUrl),
 * });
 * 
 * <input type="file" onChange={(e) => upload(e.target.files[0])} />
 */

import { useState } from "react";
import { uploadFile, type UploadConfirmation } from "@/service/upload-file/upload_file";
import { toast } from "sonner";

export interface UseFileUploadOptions {
  module: string;
  onSuccess?: (result: UploadConfirmation) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
}

export const useFileUpload = (options: UseFileUploadOptions) => {
  const { module, onSuccess, onError, showToast = true } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      if (showToast) {
        toast.loading(`Uploading ${file.name}...`, { id: "file-upload" });
      }

      const result = await uploadFile(file, module, setProgress);

      if (showToast) {
        toast.success("File uploaded successfully", { id: "file-upload" });
      }

      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Upload failed");
      setError(error);

      if (showToast) {
        toast.error(error.message, { id: "file-upload" });
      }

      onError?.(error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, progress, error };
};
