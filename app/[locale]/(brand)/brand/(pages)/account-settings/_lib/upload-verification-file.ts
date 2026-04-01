import { getSignedUrl } from "@/service/client/upload/get-signed-url";
import { uploadFileToS3 } from "@/service/client/upload/upload-file-to-s3";

export const uploadVerificationFile = async (
  file: File,
  modulePath: string,
): Promise<string | null> => {
  const signedUrlResult = await getSignedUrl({
    fileName: file.name,
    fileType: file.type,
    module: modulePath,
  });

  if (typeof signedUrlResult === "string") {
    return null;
  }

  const uploadResult = await uploadFileToS3(signedUrlResult.signedUrl, file);

  if (uploadResult !== true) {
    return null;
  }

  return signedUrlResult.publicUrl;
};