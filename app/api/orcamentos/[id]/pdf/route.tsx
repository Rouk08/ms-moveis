import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { company } from "@/lib/data";
import { orcamentoFotosDir } from "@/lib/uploads";
import OrcamentoTemplate from "@/lib/pdf/orcamento-template";

const MAX_FOTOS_NO_PDF = 8;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: {
      fotos: {
        orderBy: { createdAt: "asc" },
        take: MAX_FOTOS_NO_PDF,
      },
      itens: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!orcamento) {
    return NextResponse.json(
      { error: "Orçamento não encontrado." },
      { status: 404 }
    );
  }

  const logo = readFileSync(join(process.cwd(), "public/logo.jpg"));
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

  const fotosDir = orcamentoFotosDir(id);
  const fotosSrc = orcamento.fotos.flatMap((foto) => {
    try {
      const bytes = readFileSync(join(fotosDir, foto.caminho));
      return [`data:${foto.contentType};base64,${bytes.toString("base64")}`];
    } catch {
      return [];
    }
  });

  const buffer = await renderToBuffer(
    <OrcamentoTemplate
      orcamento={{
        nome: orcamento.nome,
        telefone: orcamento.telefone,
        email: orcamento.email,
        tipoProjeto: orcamento.tipoProjeto,
        mensagem: orcamento.mensagem,
        valorEstimado: orcamento.valorEstimado
          ? Number(orcamento.valorEstimado)
          : null,
        incluiProjeto: orcamento.incluiProjeto,
        createdAt: orcamento.createdAt,
        itens: orcamento.itens.map((i) => ({
          categoria: i.categoria,
          item: i.item,
          valorUnitario: Number(i.valorUnitario),
        })),
      }}
      company={company}
      logoSrc={logoSrc}
      fotosSrc={fotosSrc}
    />
  );

  const nomeArquivo = `orcamento-${orcamento.nome
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
    },
  });
}
