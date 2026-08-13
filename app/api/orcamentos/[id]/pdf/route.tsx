import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { company } from "@/lib/data";
import OrcamentoTemplate from "@/lib/pdf/orcamento-template";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({ where: { id } });

  if (!orcamento) {
    return NextResponse.json(
      { error: "Orçamento não encontrado." },
      { status: 404 }
    );
  }

  const logo = readFileSync(join(process.cwd(), "public/logo.jpg"));
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

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
      }}
      company={company}
      logoSrc={logoSrc}
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
