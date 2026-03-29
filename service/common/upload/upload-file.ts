import { getSignedUrl } from "./get-signed-url";
import { uploadFileToS3 } from "./upload-file-to-s3";

const MODULE = "brandguru/agency/docs";

export const uploadFile = async (file: File): Promise<string> => {
    const { signedUrl, publicUrl } = await getSignedUrl({
        fileName: file.name,
        fileType: file.type,
        module: MODULE,
    });

    await uploadFileToS3(signedUrl, file);

    return publicUrl;
};