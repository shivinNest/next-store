import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${uuidv4()}.${ext}`;
  const uploadFolder = path.join(UPLOAD_DIR, folder);

  await mkdir(uploadFolder, { recursive: true });
  await writeFile(path.join(uploadFolder, filename), buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function saveMultipleFiles(
  files: File[],
  folder: string = "products"
): Promise<string[]> {
  return Promise.all(files.map((f) => saveFile(f, folder)));
}
