export const uploadFileToS3 = async (
  signedUrl: string,
  file: File
): Promise<void> => {
  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to storage");
  }
};
