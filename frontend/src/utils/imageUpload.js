export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_SIZE_LABEL = "5 MB";
export const ACCEPTED_IMAGE_EXTENSIONS = ".png,.jpg,.jpeg,.webp";
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export function validateImageFile(file) {
  if (!file) {
    return "";
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a PNG, JPG, JPEG, or WEBP image.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Please choose an image smaller than ${MAX_IMAGE_SIZE_LABEL}.`;
  }

  return "";
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) {
    return "";
  }

  const sizeInKb = bytes / 1024;

  if (sizeInKb < 1024) {
    return `${Math.round(sizeInKb)} KB`;
  }

  return `${(sizeInKb / 1024).toFixed(1)} MB`;
}
