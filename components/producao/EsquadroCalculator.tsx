"use client";

import { useMemo, useState } from "react";
import { Ruler } from "lucide-react";

export default function EsquadroCalculator() {
  const [diag1, setDiag1] = useState("");
  const [diag2, setDiag2] = useState("");

  const resultado = useMemo(() => {
    const d1 = parseFloat(diag1);
    const d2 = parseFloat(diag2);
    if (Number.isNaN(d1) || Number.isNaN(d2) || d1 <= 0 || d2 <= 0) return null;

    const dif = Math.abs(d1 - d2);
    if (dif === 0) {
      return {
        classe: "border-moss-300 bg-moss-50 text-moss-700",
        texto: "✓ Esquadro perfeito! Diagonais idênticas (diferença: 0 mm). Caixa 100% no ângulo de 90°.",
      };
    }
    if (dif <= 1.0) {
      return {
        classe: "border-wood-300 bg-wood-50 text-wood-700",
        texto: `⚠ Tolerância limite: diferença de ${dif.toFixed(1)} mm. Aceitável se não houver portas embutidas, mas recomenda-se calibrar.`,
      };
    }
    return {
      classe: "border-red-300 bg-red-50 text-red-700",
      texto: `✗ Fora de esquadro! Diferença de ${dif.toFixed(1)} mm entre diagonais. Solte os grampos e calce o móvel antes de pregar o fundo.`,
    };
  }, [diag1, diag2]);

  return (
    <div className="rounded-xl border border-dashed border-wood-300 bg-wood-50/40 p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-wood-700">
        <Ruler size={16} />
        Verificador rápido de esquadro (diagonais)
      </h4>
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[120px] flex-1">
          <label htmlFor="diag1" className="mb-1 block text-xs font-medium text-charcoal-600">
            Diagonal 1 (mm)
          </label>
          <input
            id="diag1"
            type="number"
            inputMode="decimal"
            placeholder="ex: 1450"
            value={diag1}
            onChange={(e) => setDiag1(e.target.value)}
            className="w-full rounded-lg border border-wood-300 px-3 py-2 text-sm focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div className="min-w-[120px] flex-1">
          <label htmlFor="diag2" className="mb-1 block text-xs font-medium text-charcoal-600">
            Diagonal 2 (mm)
          </label>
          <input
            id="diag2"
            type="number"
            inputMode="decimal"
            placeholder="ex: 1450"
            value={diag2}
            onChange={(e) => setDiag2(e.target.value)}
            className="w-full rounded-lg border border-wood-300 px-3 py-2 text-sm focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>
      {resultado && (
        <div className={`mt-3 rounded-lg border px-3 py-2 text-sm font-medium ${resultado.classe}`}>
          {resultado.texto}
        </div>
      )}
    </div>
  );
}
