export type EtapaFluxo = {
  numero: number;
  titulo: string;
  fase: string;
  descricao: string;
  parametros: string[];
};

export const etapasFluxo: EtapaFluxo[] = [
  {
    numero: 1,
    titulo: "Projeto e Plano de Corte",
    fase: "Fase Preparatória",
    descricao:
      "Conferir e validar todas as medidas executivas de projeto (largura × altura × profundidade em mm) no local e no software. Definir espessuras padronizadas: MDF/Madeira 18 mm para corpo e 15 mm para fundo estrutural. Gerar lista analítica de peças (cut-list), otimizar o aproveitamento na chapa (plano de corte) e reservar 10% de sobra técnica de material para compensar perdas de serra e possíveis desvios.",
    parametros: [
      "Dimensões: L × A × P em mm",
      "Corpo: 18 mm",
      "Fundo: 15 mm",
      "Sobra: 10% chapa",
      "Arquivo: Cut-list liberada",
    ],
  },
  {
    numero: 2,
    titulo: "Corte e Fitamento",
    fase: "Usinagem Primária",
    descricao:
      "Cortar as chapas em seccionadora ou serra circular com riscador afiado, respeitando rigorosamente a tolerância dimensional de ±1,0 mm. Revestir os topos/cantos indicados com fita de borda (acabamento/acistamento) imediatamente após o corte para blindar contra umidade mecânica. Identificar cada componente com etiqueta adesiva padrão: código da peça, célula de montagem e número da ordem de serviço.",
    parametros: [
      "Equipamento: Seccionadora / Serra com riscador",
      "Tolerância: ±1,0 mm",
      "Borda: Fita imediata",
      "Rastreio: Etiqueta (Cód / Célula / OS)",
    ],
  },
  {
    numero: 3,
    titulo: "Usinagem e Furação",
    fase: "Precisão Mecânica",
    descricao:
      "Operar furadeiras múltiplas e pinóculos de bancada para furação técnica padronizada: furos para cavilhas de 8 mm com profundidade calibrada, tambores e parafusos de minifix com gabarito. Executar o alinhamento de cantos, definir raios e folga/recuo de portas de 3,0 mm. Realizar fresamento do canal para embutimento/rebaixo do painel posterior (fundo).",
    parametros: [
      "Cavilhas: Ø 8 mm",
      "Ferragem: Minifix estrutural",
      "Folga portas: 3,0 mm",
      "Fresagem: Canal de fundo",
    ],
  },
  {
    numero: 4,
    titulo: "Lixamento e Preparação",
    fase: "Tratamento Superficial",
    descricao:
      "Passar lixa mecânica e manual obedecendo a escala gradativa de grãos conforme o acabamento especificado (madeira maciça ou MDF crú). Remover imperfeições, rebarbas e excessos de cola da fita de borda utilizando raspador manual e lixa fina. Executar inspeção tátil e visual sob luz tangencial para detectar afinamentos, depressões, marcas de serra ou riscos antes da pintura/montagem.",
    parametros: [
      "Lixamento: Grão progressivo",
      "Topos: Desbaste de rebarbas",
      "Inspeção: Luz tangencial",
    ],
  },
  {
    numero: 5,
    titulo: "Acabamento / Pintura",
    fase: "Cabine de Pintura",
    descricao:
      "Aplicar selador, verniz poliuretânico, laqueação acetinada ou laca brilhante conforme memorial descritivo do cliente. Realizar o ciclo controlado de secagem e cura em cabine com exaustão e ambiente livre de poeira suspensa. Conferir uniformidade de cobertura, estanqueidade dos topos, espessura da camada de película e ausência de casca-de-laranja ou escorrimento.",
    parametros: [
      "Acabamento: Verniz / Laca / PU",
      "Ambiente: Cabine pressurizada",
      "Inspeção: Espessura e textura uniforme",
    ],
  },
  {
    numero: 6,
    titulo: "Montagem Estrutural",
    fase: "Montagem Prévia",
    descricao:
      "Montar corpos de gavetas e fixar corrediças (telescópicas ou invisíveis). Bater e unir as laterais com cavilhas coladas de 8 mm e aperto de minifix. Encaixar e travar o painel posterior estrutural de 15 mm. Fixar rosetas, dobradiças metálicas de pressão com amortecedor e puxadores. Realizar obrigatoriamente a conferência de esquadro (quadratura pelas diagonais) antes do travamento total.",
    parametros: [
      "Fixação: Cavilhas + Minifix",
      "Fundo: 15 mm travado",
      "Ferragens: Corrediças e dobradiças",
      "Garantia: Diagonais idênticas",
    ],
  },
  {
    numero: 7,
    titulo: "Inspeção de Qualidade (Controle)",
    fase: "Checklist de Liberação",
    descricao:
      "Aplicar checklist minucioso de 4 pontos obrigatórios: Esquadro (desvio diagonal nulo, 0,0 mm), Alinhamento (folga padronizada de 3,0 mm entre frentes de gavetas e portas), Funcionamento (abertura macia e amortecimento sem atrito) e Acabamento (superfícies isentas de arranhões, resquícios de cola ou furos expostos). Aprovado: liberar para expedição. Reprovado: abrir OS de retrabalho na célula de origem.",
    parametros: [
      "Critério 1: Esquadro 90°",
      "Critério 2: Folga 3 mm",
      "Critério 3: Teste mecânico",
      "Decisão: Liberar / Retrabalhar",
    ],
  },
  {
    numero: 8,
    titulo: "Embalagem e Expedição",
    fase: "Saída / Logística",
    descricao:
      "Limpeza final com desengordurante suave e pano de microfibra. Proteger cantos com cantoneiras plásticas ou papelão reforçado. Embalar módulos com filme stretch e manta de espuma/plástico-bolha de alta densidade. Colar etiqueta externa com: nome do cliente, ambiente, número do volume, número da ordem de serviço e advertência de manuseio. Conferir lista de embarque e registrar saída no sistema.",
    parametros: [
      "Proteção: Cantoneiras + Filme + Espuma",
      "Identificação: Etiqueta Cliente/OS",
      "Logística: Conferência de romaneio",
    ],
  },
];

export const ferragensPadrao: { insumo: string; especificacao: string; aplicacao: string }[] = [
  {
    insumo: "Cavilhas",
    especificacao: "Madeira faia raiada Ø 8 mm × 35 mm",
    aplicacao: "Alinhamento e resistência ao cisalhamento",
  },
  {
    insumo: "Minifix",
    especificacao: "Tambor de zamac 15 mm + parafuso expansivo",
    aplicacao: "Junção desmontável e estrutural de caixarias",
  },
  {
    insumo: "Corrediças",
    especificacao: "Telescópica reforçada ou oculta slow-motion",
    aplicacao: "Gavetas internas e externas (suporte min. 35 kg)",
  },
  {
    insumo: "Dobradiças",
    especificacao: "Caneco 35 mm com pistão amortecedor (110° / 165°)",
    aplicacao: "Portas de bater e cantos móveis",
  },
  {
    insumo: "Fita de Borda",
    especificacao: "PVC 0,45 mm (interna) e 1,0 a 2,0 mm (frentes/portas)",
    aplicacao: "Acabamento, impermeabilização e toque ergonômico",
  },
  {
    insumo: "Painel de Fundo",
    especificacao: "Chapa MDF 15 mm com canal rebaixado",
    aplicacao: "Garantia de quadratura estrutural e suporte de peso",
  },
];

export const dicasOperacionais: { titulo: string; texto: string }[] = [
  {
    titulo: "Etiquetar peças no ato do corte",
    texto:
      "Nunca deixe uma chapa sem etiqueta após a seccionadora. Identifique lado superior, face aparente e sentido do veio do MDF.",
  },
  {
    titulo: "Conferir cut-list antes de furar",
    texto:
      "Meça a peça física com trena calibrada antes de colocá-la na furação. Furo errado gera perda total do painel revestido.",
  },
  {
    titulo: "Verificação de esquadro cruzado (diagonal)",
    texto:
      "Nunca confie apenas no esquadro de 90° em caixarias grandes. Meça as duas diagonais cruzadas (D1 e D2). Se D1 ≠ D2, a caixa está torta.",
  },
  {
    titulo: "Limpeza contínua da bancada",
    texto:
      "Serragem ou lascas sob a chapa durante o aperto do minifix riscam a fórmica e tiram o móvel do plano perfeito.",
  },
];

export const kpisFluxo: { label: string; valor: string; nota: string }[] = [
  { label: "Tolerância de Corte", valor: "±1,0 mm", nota: "Garantir ajuste de montagem" },
  { label: "Corpo & Fundo Padrão", valor: "18 mm / 15 mm", nota: "Corpo 18mm · Fundo estrutural 15mm" },
  { label: "Folga Portas & Gavetas", valor: "3,0 mm", nota: "Folga periférica padronizada" },
  { label: "Reserva Técnica", valor: "10% sobra", nota: "Calculada no plano de corte" },
];
