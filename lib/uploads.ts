import { join } from "path";

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_FILES_PER_UPLOAD = 10;

export function uploadsRoot() {
  return join(process.cwd(), "uploads");
}

export function orcamentoFotosDir(orcamentoId: string) {
  return join(uploadsRoot(), "orcamentos", orcamentoId);
}
