import { join } from "path";

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Comprovantes aceitam também PDF — notas fiscais e boletos costumam
// vir nesse formato, não só foto.
export const ALLOWED_RECEIPT_TYPES: Record<string, string> = {
  ...ALLOWED_IMAGE_TYPES,
  "application/pdf": "pdf",
};

export const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_FILES_PER_UPLOAD = 10;

export function uploadsRoot() {
  return join(process.cwd(), "uploads");
}

export function orcamentoFotosDir(orcamentoId: string) {
  return join(uploadsRoot(), "orcamentos", orcamentoId);
}

export function contaPagarComprovantesDir(contaPagarId: string) {
  return join(uploadsRoot(), "contas-pagar", contaPagarId);
}

export function aporteComprovantesDir(aporteId: string) {
  return join(uploadsRoot(), "aportes", aporteId);
}
