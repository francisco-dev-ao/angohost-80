
export interface EmailPlan {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  features: { text: string; included: boolean; }[];
  popular?: boolean;
}

export const emailPlans: EmailPlan[] = [
  {
    id: "basic",
    title: "Email Básico",
    description: "Para pequenas empresas e freelancers",
    basePrice: 1500,
    features: [
      { text: "5 GB de armazenamento", included: true },
      { text: "Domínio personalizado", included: true },
      { text: "Proteção contra spam", included: true },
      { text: "Acesso webmail", included: true },
      { text: "Suporte limitado", included: true },
      { text: "Backup diário", included: false },
      { text: "Calendário compartilhado", included: false },
      { text: "Integração com aplicativos", included: false }
    ]
  },
  {
    id: "business",
    title: "Email Business",
    description: "Para empresas em crescimento",
    basePrice: 3000,
    popular: true,
    features: [
      { text: "15 GB de armazenamento", included: true },
      { text: "Domínio personalizado", included: true },
      { text: "Proteção contra spam", included: true },
      { text: "Acesso webmail", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "Backup diário", included: true },
      { text: "Calendário compartilhado", included: true },
      { text: "Integração com aplicativos", included: false }
    ]
  },
  {
    id: "enterprise",
    title: "Email Enterprise",
    description: "Para grandes empresas",
    basePrice: 5000,
    features: [
      { text: "50 GB de armazenamento", included: true },
      { text: "Domínio personalizado", included: true },
      { text: "Proteção contra spam", included: true },
      { text: "Acesso webmail", included: true },
      { text: "Suporte dedicado", included: true },
      { text: "Backup diário", included: true },
      { text: "Calendário compartilhado", included: true },
      { text: "Integração com aplicativos", included: true }
    ]
  }
];

export const getPlanById = (id: string): EmailPlan | undefined => {
  return emailPlans.find(plan => plan.id === id);
};
