import axios from "axios";

export const uploadFileToS3 = async (
    signedUrl: string,
    file: File
): Promise<void> => {
    await axios.put(signedUrl, file, {
        headers: {
            "Content-Type": file.type,
        },
    });
};