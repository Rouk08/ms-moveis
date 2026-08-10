import {
  ChefHat,
  BedDouble,
  Sofa,
  Bath,
  Briefcase,
  Building2,
  type LucideIcon,
} from "lucide-react";

export const company = {
  name: "MS Móveis Sob Medida",
  shortName: "MS Móveis",
  slogan: "Móveis Sob Medida que Transformam Seu Espaço",
  description:
    "Marcenaria especializada em móveis planejados e sob medida para ambientes residenciais e comerciais em Gaspar, Blumenau, Brusque e todo o Vale do Itajaí.",
  foundingYear: 2011,
  yearsOfExperience: new Date().getFullYear() - 2011,
  address: {
    street: "Rua 1 de Janeiro, 30",
    neighborhood: "Bairro Sete de Setembro",
    city: "Gaspar",
    state: "SC",
    stateFull: "Santa Catarina",
    zip: "89111-000",
    full: "Rua 1 de Janeiro, 30 — Bairro Sete de Setembro, Gaspar/SC",
  },
  phone: {
    display: "(47) 3333-4444",
    raw: "554733334444",
  },
  whatsapp: {
    display: "(47) 99999-8888",
    raw: "5547999998888",
  },
  email: "contato@msmoveissobmedida.com.br",
  social: {
    instagram: "https://instagram.com/msmoveissobmedida",
    facebook: "https://facebook.com/msmoveissobmedida",
  },
  hours: [
    { day: "Segunda a Sexta", time: "08h às 18h" },
    { day: "Sábado", time: "08h às 12h" },
    { day: "Domingo", time: "Fechado" },
  ],
  mapEmbedSrc:
    "https://www.google.com/maps?q=Rua+1+de+Janeiro,+30,+Sete+de+Setembro,+Gaspar+-+SC&output=embed",
  serviceArea: ["Gaspar", "Blumenau", "Brusque", "Vale do Itajaí"],
};

export type Service = {
  slug: string;
  title: string;
  icon: LucideIcon;
  shortDescription: string;
  description: string;
  features: string[];
  image: string;
};

export const services: Service[] = [
  {
    slug: "cozinhas-planejadas",
    title: "Cozinhas Planejadas",
    icon: ChefHat,
    shortDescription:
      "Cozinhas planejadas que unem funcionalidade, ergonomia e beleza para o coração da sua casa.",
    description:
      "Projetamos cozinhas planejadas sob medida que aproveitam cada centímetro do ambiente, com acabamentos de alta durabilidade e ferragens de qualidade premium. Do armário aéreo à ilha central, cada detalhe é pensado para o seu jeito de cozinhar.",
    features: [
      "Aproveitamento total do espaço",
      "Bancadas e acabamentos resistentes à umidade",
      "Ferragens com amortecimento silencioso",
      "Iluminação de destaque embutida",
    ],
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "quartos-planejados",
    title: "Quartos Planejados",
    icon: BedDouble,
    shortDescription:
      "Guarda-roupas, closets e painéis sob medida para um quarto que é puro conforto.",
    description:
      "Criamos dormitórios planejados que maximizam a organização e trazem aconchego, com guarda-roupas, criados-mudos, painéis de TV e closets desenhados sob medida para o seu estilo de vida.",
    features: [
      "Closets e guarda-roupas otimizados",
      "Painéis de TV integrados",
      "Iluminação interna de gavetas e nichos",
      "Divisórias internas personalizadas",
    ],
    image:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "salas-de-estar",
    title: "Salas de Estar",
    icon: Sofa,
    shortDescription:
      "Painéis, racks e estantes planejadas que valorizam o ambiente de convivência.",
    description:
      "Desenvolvemos móveis planejados para salas de estar e de jantar que equilibram estética e praticidade, com painéis para TV, estantes, adegas e buffets integrados ao seu projeto de decoração.",
    features: [
      "Painéis de TV com passagem de fiação oculta",
      "Estantes e nichos decorativos",
      "Buffets e adegas planejadas",
      "Integração com sala de jantar",
    ],
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "banheiros",
    title: "Banheiros",
    icon: Bath,
    shortDescription:
      "Gabinetes e armários planejados com materiais resistentes à umidade.",
    description:
      "Fabricamos gabinetes, armários e nichos planejados para banheiros com materiais próprios para áreas úmidas, unindo design contemporâneo à durabilidade que esse ambiente exige.",
    features: [
      "Materiais próprios para áreas molhadas",
      "Cubas e torneiras integradas ao projeto",
      "Espelheiras com iluminação",
      "Otimização de espaço em lavabos pequenos",
    ],
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "home-office",
    title: "Home Office",
    icon: Briefcase,
    shortDescription:
      "Escritórios planejados que aumentam produtividade sem abrir mão do design.",
    description:
      "Projetamos estações de trabalho e escritórios planejados sob medida, com bancadas ergonômicas, armários para documentos e soluções de organização de cabos para o seu home office.",
    features: [
      "Bancadas ergonômicas sob medida",
      "Organização de cabos e equipamentos",
      "Armários e estantes para documentos",
      "Aproveitamento de espaços pequenos",
    ],
    image:
      "https://images.unsplash.com/photo-1593476550610-87baa860004a?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "projetos-comerciais",
    title: "Projetos Comerciais",
    icon: Building2,
    shortDescription:
      "Móveis planejados para lojas, escritórios e consultórios com identidade própria.",
    description:
      "Atendemos empresas de Gaspar, Blumenau e região com projetos comerciais sob medida: balcões, recepções, gôndolas e ambientes corporativos que reforçam a identidade da sua marca.",
    features: [
      "Balcões e recepções personalizadas",
      "Ambientes corporativos e consultórios",
      "Gôndolas e expositores sob medida",
      "Prazos compatíveis com a operação do negócio",
    ],
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop",
  },
];

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Visita Técnica",
    description:
      "Vamos até o seu espaço para medir o ambiente, entender suas necessidades e ouvir suas ideias sem compromisso.",
  },
  {
    step: 2,
    title: "Projeto 3D",
    description:
      "Desenvolvemos um projeto 3D personalizado para você visualizar cada detalhe do móvel antes da fabricação.",
  },
  {
    step: 3,
    title: "Fabricação",
    description:
      "Com o projeto aprovado, fabricamos seus móveis sob medida em nossa marcenaria, com materiais de qualidade.",
  },
  {
    step: 4,
    title: "Instalação",
    description:
      "Nossa equipe realiza a entrega e instalação com precisão, garantindo acabamento perfeito e pontualidade.",
  },
];

export type Testimonial = {
  name: string;
  location: string;
  rating: number;
  text: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Fernanda Souza",
    location: "Gaspar/SC",
    rating: 5,
    text: "A cozinha planejada ficou exatamente como no projeto 3D. A equipe da MS Móveis foi atenciosa do início ao fim e cumpriu o prazo combinado. Recomendo demais!",
  },
  {
    name: "Ricardo Homrich",
    location: "Blumenau/SC",
    rating: 5,
    text: "Fizemos o quarto planejado do casal e o closet superou as expectativas. Qualidade de material excelente e acabamento impecável. Já estamos planejando a sala com eles.",
  },
  {
    name: "Juliana Pereira",
    location: "Brusque/SC",
    rating: 5,
    text: "Contratei a MS para o meu consultório e o resultado foi um ambiente muito mais profissional. Aproveitaram bem cada canto do espaço, que não era grande.",
  },
  {
    name: "Marcos Vinícius",
    location: "Gaspar/SC",
    rating: 4,
    text: "Ótimo custo-benefício e muita transparência durante todo o processo. O home office ficou funcional e bonito, exatamente o que eu precisava para trabalhar de casa.",
  },
];

export type PortfolioItem = {
  title: string;
  category: string;
  image: string;
};

export const portfolio: PortfolioItem[] = [
  {
    title: "Cozinha Planejada Contemporânea",
    category: "Cozinhas",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop",
  },
  {
    title: "Closet Sob Medida",
    category: "Quartos",
    image:
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80&auto=format&fit=crop",
  },
  {
    title: "Painel de TV com Estante",
    category: "Salas",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80&auto=format&fit=crop",
  },
  {
    title: "Home Office Compacto",
    category: "Escritórios",
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80&auto=format&fit=crop",
  },
  {
    title: "Banheiro com Gabinete Planejado",
    category: "Banheiros",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=80&auto=format&fit=crop",
  },
  {
    title: "Recepção Comercial",
    category: "Comercial",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80&auto=format&fit=crop",
  },
];

export const differentiators = [
  {
    title: "Madeira de Qualidade",
    description:
      "Trabalhamos com MDF de alta densidade e madeiras selecionadas, garantindo durabilidade para o seu móvel sob medida.",
  },
  {
    title: "Projeto 3D Personalizado",
    description:
      "Você visualiza cada detalhe do seu móvel planejado antes da fabricação, com liberdade para ajustar o projeto.",
  },
  {
    title: "Entrega e Instalação",
    description:
      "Cuidamos de tudo, da fabricação à instalação final, com equipe própria e pontualidade no prazo combinado.",
  },
  {
    title: "Garantia",
    description:
      "Oferecemos garantia em todos os projetos, com suporte pós-instalação para o que você precisar.",
  },
];
