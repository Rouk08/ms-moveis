"use client";

import { useRef, useState } from "react";
import { FileText, Paperclip, Trash2 } from "lucide-react";

type Comprovante = {
  id: string;
  nomeArquivo: string;
  contentType: string;
};

type ComprovantesProps = {
  tipo: "contas-pagar" | "aportes";
  entidadeId: string;
  comprovantesIniciais: Comprovante[];
};

export default function Comprovantes({
  tipo,
  entidadeId,
  comprovantesIniciais,
}: ComprovantesProps) {
  const [comprovantes, setComprovantes] = useState(comprovantesIniciais);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const basePath = `/api/${tipo}/${entidadeId}/comprovantes`;

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setUploading(true);

    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("comprovantes", file));

    try {
      const res = await fetch(basePath, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível enviar o comprovante.");
        setUploading(false);
        return;
      }

      window.location.reload();
    } catch {
      setError("Não foi possível enviar o comprovante. Tente novamente.");
      setUploading(false);
    }
  };

  const handleDelete = async (comprovanteId: string) => {
    if (!window.confirm("Excluir este comprovante?")) return;

    setDeletingId(comprovanteId);
    setError(null);

    try {
      const res = await fetch(`${basePath}/${comprovanteId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível excluir o comprovante.");
        setDeletingId(null);
        return;
      }

      setComprovantes((prev) => prev.filter((c) => c.id !== comprovanteId));
      setDeletingId(null);
    } catch {
      setError("Não foi possível excluir o comprovante. Tente novamente.");
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-charcoal-800">Comprovantes</h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full bg-wood-500 px-4 py-2 text-sm font-semibold text-white hover:bg-wood-600 disabled:opacity-60 transition-colors"
        >
          <Paperclip size={15} />
          {uploading ? "Enviando..." : "Anexar comprovante"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {comprovantes.length === 0 ? (
        <p className="text-sm text-charcoal-400">
          Nenhum comprovante anexado ainda. Use &ldquo;Anexar
          comprovante&rdquo; para enviar nota fiscal, recibo ou
          comprovante de pagamento (JPG, PNG, WEBP ou PDF).
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {comprovantes.map((comprovante) => {
            const href = `${basePath}/${comprovante.id}`;
            const isImagem = comprovante.contentType.startsWith("image/");
            return (
              <div key={comprovante.id} className="group relative">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border border-charcoal-100 bg-charcoal-50"
                >
                  {isImagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={href}
                      alt={comprovante.nomeArquivo}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                      <FileText size={28} className="text-wood-500" />
                      <span className="line-clamp-2 text-xs text-charcoal-600 break-all">
                        {comprovante.nomeArquivo}
                      </span>
                    </div>
                  )}
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(comprovante.id)}
                  disabled={deletingId === comprovante.id}
                  aria-label={`Excluir ${comprovante.nomeArquivo}`}
                  className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-900/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 disabled:opacity-60 transition-opacity"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
