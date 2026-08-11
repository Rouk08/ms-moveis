"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { company } from "@/lib/data";
import { createOrcamentoFromSite } from "@/lib/actions/orcamento-publico";

type FormState = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  projectType: "Cozinha Planejada",
  message: "",
};

const projectTypes = [
  "Cozinha Planejada",
  "Quarto Planejado",
  "Sala de Estar",
  "Banheiro",
  "Home Office",
  "Projeto Comercial",
  "Outro",
];

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Informe o seu nome.";
    if (form.phone.replace(/\D/g, "").length < 10)
      nextErrors.phone = "Informe um telefone válido com DDD.";
    if (!isValidEmail(form.email)) nextErrors.email = "Informe um e-mail válido.";
    if (!form.message.trim()) nextErrors.message = "Conte um pouco sobre o seu projeto.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const lines = [
      "Olá! Vim pelo site da MS Móveis Sob Medida e gostaria de solicitar um orçamento.",
      "",
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      `E-mail: ${form.email}`,
      `Tipo de projeto: ${form.projectType}`,
      `Mensagem: ${form.message}`,
    ];

    const whatsappUrl = `https://wa.me/${company.whatsapp.raw}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;

    setSubmitted(true);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    createOrcamentoFromSite({
      nome: form.name,
      telefone: form.phone,
      email: form.email,
      tipoProjeto: form.projectType,
      mensagem: form.message,
    }).catch(() => {
      // Best-effort: se o registro no painel falhar, o fluxo de WhatsApp
      // já aconteceu e o cliente não deve perceber nenhuma diferença.
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Nome completo *
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          placeholder="Seu nome"
        />
        {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-charcoal-700 mb-1.5">
            Telefone / WhatsApp *
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => handleChange("phone", maskPhone(e.target.value))}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
            placeholder="(47) 99999-8888"
          />
          {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-1.5">
            E-mail *
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
            placeholder="seuemail@exemplo.com"
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Tipo de projeto
        </label>
        <select
          id="projectType"
          value={form.projectType}
          onChange={(e) => handleChange("projectType", e.target.value)}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        >
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Mensagem *
        </label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          placeholder="Conte um pouco sobre o ambiente que deseja planejar..."
        />
        {errors.message && <p className="mt-1.5 text-sm text-red-600">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-wood-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 transition-colors"
      >
        Enviar via WhatsApp
        <Send size={16} />
      </button>

      {submitted && (
        <p className="text-sm text-moss-600">
          Sua mensagem foi preparada no WhatsApp. Se a janela não abriu, verifique o
          bloqueador de pop-ups do navegador.
        </p>
      )}
    </form>
  );
}
