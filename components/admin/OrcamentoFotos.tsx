"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";

type Foto = {
  id: string;
  nomeArquivo: string;
};

type OrcamentoFotosProps = {
  orcamentoId: string;
  fotosIniciais: Foto[];
};

export default function OrcamentoFotos({
  orcamentoId,
  fotosIniciais,
}: OrcamentoFotosProps) {
  const [fotos, setFotos] = useState(fotosIniciais);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Foto | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setUploading(true);

    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("fotos", file));

    try {
      const res = await fetch(`/api/orcamentos/${orcamentoId}/fotos`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível enviar as fotos.");
        setUploading(false);
        return;
      }

      window.location.reload();
    } catch {
      setError("Não foi possível enviar as fotos. Tente novamente.");
      setUploading(false);
    }
  };

  const handleDelete = async (fotoId: string) => {
    if (!window.confirm("Excluir esta foto?")) return;

    setDeletingId(fotoId);
    setError(null);

    try {
      const res = await fetch(
        `/api/orcamentos/${orcamentoId}/fotos/${fotoId}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível excluir a foto.");
        setDeletingId(null);
        return;
      }

      setFotos((prev) => prev.filter((f) => f.id !== fotoId));
      setDeletingId(null);
    } catch {
      setError("Não foi possível excluir a foto. Tente novamente.");
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-charcoal-800">Fotos do projeto</h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full bg-wood-500 px-4 py-2 text-sm font-semibold text-white hover:bg-wood-600 disabled:opacity-60 transition-colors"
        >
          <ImagePlus size={16} />
          {uploading ? "Enviando..." : "Anexar fotos"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
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

      {fotos.length === 0 ? (
        <p className="text-sm text-charcoal-400">
          Nenhuma foto anexada ainda. Use &ldquo;Anexar fotos&rdquo; para
          adicionar fotos do ambiente, referências ou o que o cliente
          enviou.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {fotos.map((foto) => (
            <div key={foto.id} className="group relative">
              <button
                type="button"
                onClick={() => setPreview(foto)}
                className="block w-full aspect-square overflow-hidden rounded-xl border border-charcoal-100 bg-charcoal-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/orcamentos/${orcamentoId}/fotos/${foto.id}`}
                  alt={foto.nomeArquivo}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(foto.id)}
                disabled={deletingId === foto.id}
                aria-label={`Excluir ${foto.nomeArquivo}`}
                className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-900/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 disabled:opacity-60 transition-opacity"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/80 p-6"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            onClick={() => setPreview(null)}
            aria-label="Fechar"
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/orcamentos/${orcamentoId}/fotos/${preview.id}`}
            alt={preview.nomeArquivo}
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
