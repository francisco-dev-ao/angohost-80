
export interface EmailPlan {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  renewalPrice: number;
  features: { text: string; included: boolean; }[];
  popular?: boolean;
}

export const emailPlans: EmailPlan[] = [
  {
    id: "premium",
    title: "Email Premium",
    description: "Para pequenas empresas e freelancers",
    basePrice: 12000,
    renewalPrice: 14500,
    features: [
      { text: "5 GB por usuário", included: true },
      { text: "IMAP/POP", included: true },
      { text: "Reputação do IP limpo", included: true },
      { text: "Classificado pelo Google", included: true },
      { text: "Suporte padrão", included: true },
      { text: "Verificação antivírus básica", included: false },
      { text: "Anti-spam avançado", included: false },
      { text: "Aliases de email", included: false }
    ]
  },
  {
    id: "business",
    title: "Business",
    description: "Para empresas em crescimento",
    basePrice: 30000,
    renewalPrice: 32000,
    features: [
      { text: "30 GB por usuário", included: true },
      { text: "IMAP/POP", included: true },
      { text: "Reputação do IP limpo", included: true },
      { text: "Classificado pelo Google", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "Verificação antivírus", included: true },
      { text: "Anti-spam básico", included: true },
      { text: "Aliases de email", included: true }
    ]
  },
  {
    id: "advanced",
    title: "Avançado Pro",
    description: "Para grandes empresas",
    basePrice: 40000,
    renewalPrice: 42000,
    popular: true,
    features: [
      { text: "50 GB por usuário", included: true },
      { text: "Regras de Encaminhamento", included: true },
      { text: "Aliases de email", included: true },
      { text: "Verificação Antivírus", included: true },
      { text: "Anti-spam avançado", included: true },
      { text: "Infraestrutura baseada na nuvem", included: true },
      { text: "Suporte dedicado", included: true },
      { text: "Recursos administrativos avançados", included: true }
    ]
  }
];

export const getPlanById = (id: string): EmailPlan | undefined => {
  return emailPlans.find(plan => plan.id === id);
};
