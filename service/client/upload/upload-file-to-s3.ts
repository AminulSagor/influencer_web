export const uploadFileToS3 = async (
  signedUrl: string,
  file: File,
): Promise<true | string> => {
  try {
    const response = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) {
      return "Failed to upload file";
    }

    return true;
  } catch {
    return "Failed to upload file";
  }
};