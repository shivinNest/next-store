import cloudinary from "./config";

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Map local folder names to Cloudinary folder paths
const FOLDER_MAP: Record<string, string> = {
  avatars: "saaviya/avatars",
  products: "saaviya/products",
  payments: "saaviya/payments",
  banners: "saaviya/banners",
  categories: "saaviya/categories",
  blogs: "saaviya/blogs",
  misc: "saaviya/misc",
};

function getCloudinaryFolder(folder: string): string {
  return FOLDER_MAP[folder] ?? `saaviya/${folder}`;
}

/**
 * Upload a single File to Cloudinary.
 * Returns the secure HTTPS URL of the uploaded image.
 */
export async function saveFile(
  file: File,
  folder: string = "misc"
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, WebP, GIF allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const cloudFolder = getCloudinaryFolder(folder);

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: cloudFolder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve(result as { secure_url: string });
      }
    );
    stream.end(buffer);
  });

  return result.secure_url;
}

/**
 * Upload multiple Files to Cloudinary concurrently.
 * Returns an array of secure HTTPS URLs.
 */
export async function saveMultipleFiles(
  files: File[],
  folder: string = "products"
): Promise<string[]> {
  return Promise.all(files.map((f) => saveFile(f, folder)));
}

/**
 * Delete an image from Cloudinary by its public ID or full URL.
 */
export async function deleteFile(urlOrPublicId: string): Promise<void> {
  // Extract public_id from a full Cloudinary URL if needed
  let publicId = urlOrPublicId;
  if (urlOrPublicId.startsWith("http")) {
    const match = urlOrPublicId.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    if (match) publicId = match[1];
  }
  await cloudinary.uploader.destroy(publicId);
}
