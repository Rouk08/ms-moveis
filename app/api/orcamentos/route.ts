import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseItensFromBody } from "@/lib/orcamento-itens";
import { parseParcelasFromBody } from "@/lib/orcamento-parcelas";
import type { FormaPagamento } from "@/lib/generated/prisma/enums";

const FORMA_PAGAMENTO_VALUES: FormaPagamento[] = [
  "DINHEIRO",
  "PIX",
  "CARTAO_CREDITO",
  "CARTAO_DEBITO",
  "BOLETO",
  "TRANSFERENCIA",
];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const nome = String(body.nome ?? "").trim();
  const telefone = String(body.telefone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const tipoProjeto = Array.isArray(body.tipoProjeto)
    ? body.tipoProjeto.map((t: unknown) => String(t).trim()).filter(Boolean)
    : [];
  const mensagem = String(body.mensagem ?? "").trim();
  const incluiProjeto = body.incluiProjeto !== false;
  const itens = parseItensFromBody(body);
  const valorEstimadoRaw = String(body.valorEstimado ?? "").trim();
  const descontoRaw = String(body.desconto ?? "").trim();
  const formaPagamentoRaw = String(body.formaPagamento ?? "").trim();
  const formaPagamento = FORMA_PAGAMENTO_VALUES.includes(
    formaPagamentoRaw as FormaPagamento
  )
    ? (formaPagamentoRaw as FormaPagamento)
    : null;
  const parcelas = parseParcelasFromBody(body);
  const parcelado = parcelas.length > 1;
  const numeroParcelas = parcelado ? parcelas.length : null;

  if (!nome || !telefone || !mensagem) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  const orcamento = await prisma.orcamento.create({
    data: {
      nome,
      telefone,
      email: email || null,
      tipoProjeto,
      mensagem,
      incluiProjeto,
      valorEstimado: valorEstimadoRaw || null,
      desconto: descontoRaw || null,
      formaPagamento,
      parcelado,
      numeroParcelas,
      origem: "MANUAL",
      itens: {
        create: itens.map((i) => ({
          categoria: i.categoria,
          item: i.item,
          valorUnitario: i.valorUnitario,
          observacao: i.observacao || null,
        })),
      },
      parcelas: {
        create: parcelas.map((p, index) => ({
          ordem: index,
          descricao: p.descricao,
          valor: p.valor,
          vencimento: p.vencimento || null,
        })),
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");

  return NextResponse.json({ id: orcamento.id });
}
