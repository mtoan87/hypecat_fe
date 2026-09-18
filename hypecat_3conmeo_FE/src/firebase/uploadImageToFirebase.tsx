const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "video"
): Promise<string> {
  if (!cloudName || !uploadPreset) {
    throw new Error("Thiếu cấu hình Cloudinary trong file .env.local.");
  }

  const maxSizeInBytes = (resourceType === "image" ? 5 : 50) * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error(
      `File quá lớn. Kích thước tối đa là ${resourceType === "image" ? 5 : 50}MB.`
    );
  }

  if (
    resourceType === "image" &&
    !["image/jpeg", "image/png", "image/webp"].includes(file.type)
  ) {
    throw new Error("Chỉ hỗ trợ file JPG, PNG hoặc WEBP.");
  }

  if (resourceType === "video" && !file.type.startsWith("video/")) {
    throw new Error("File không phải video.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "hypecat");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Upload Cloudinary thất bại.");
  }

  return data.secure_url;
}

export function uploadImageToFirebase(file: File): Promise<string> {
  return uploadToCloudinary(file, "image");
}

export function uploadVideoToFirebase(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  onProgress?.(0);
  return uploadToCloudinary(file, "video").then((url) => {
    onProgress?.(100);
    return url;
  });
}
