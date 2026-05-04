import { uploadFile } from "@/service/upload-file/upload_file";

export const uploadVerificationFile = async (
  file: File,
  modulePath: string,
): Promise<string | null> => {
  try {
    const uploadResult = await uploadFile(file, modulePath);
    return uploadResult.publicUrl || null;
  } catch {
    return null;
  }
};
