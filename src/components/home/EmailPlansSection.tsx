import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Mail, Shield, Globe, Laptop, Phone, ArrowRight } from "lucide-react";

const EmailPlansSection = () => {
  const emailPlans = [
    {
      name: "Básico",
      price: "990",
      period: "mês",
      features: [
        "5GB de espaço",
        "5 contas de email",
        "Acesso webmail",
        "Proteção anti-spam",
        "Suporte por email"
      ],
      popular: false
    },
    {
      name: "Profissional",
      price: "1.990",
      period: "mês",
      features: [
        "15GB de espaço",
        "15 contas de email",
        "Webmail + app móvel",
        "Proteção anti-spam avançada",
        "Suporte prioritário"
      ],
      popular: true
    },
    {
      name: "Empresarial",
      price: "3.490",
      period: "mês",
      features: [
        "50GB de espaço",
        "Contas ilimitadas",
        "Acesso em todos dispositivos",
        "Segurança avançada",
        "Suporte 24/7"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Email Profissional para sua Empresa</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Comunique-se profissionalmente com seu próprio domínio e mantenha sua correspondência segura.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email Profissional</h3>
            <p className="text-gray-600 text-sm">
              Use emails com seu domínio para uma presença profissional e maior credibilidade.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Segurança Avançada</h3>
            <p className="text-gray-600 text-sm">
              Proteção contra spam, vírus e ataques de phishing para manter seus dados seguros.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Laptop className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Acesso em Qualquer Lugar</h3>
            <p className="text-gray-600 text-sm">
              Acesse seus emails em qualquer dispositivo com nossa interface intuitiva.
            </p>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {emailPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl overflow-hidden border transition-all ${
                plan.popular 
                  ? "border-blue-400 shadow-xl relative transform hover:-translate-y-1" 
                  : "border-gray-200 shadow-md hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              
              <div className={`p-6 ${plan.popular ? "bg-blue-50" : ""}`}>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold">AOA {plan.price}</span>
                  <span className="ml-1 text-gray-500">/{plan.period}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 p-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild
                  className={`mt-6 w-full ${
                    plan.popular 
                      ? "bg-blue-500 hover:bg-blue-600" 
                      : "bg-gray-800 hover:bg-gray-900"
                  }`}
                >
                  <Link to="/products/email">
                    Escolher plano
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild variant="outline" size="lg" className="font-medium">
            <Link to="/products/email" className="flex items-center gap-2">
              Ver todos os planos <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EmailPlansSection;
