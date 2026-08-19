"use client";

import { useState, type FormEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { company, projectTypes } from "@/lib/data";
import { createOrcamentoFromSite } from "@/lib/actions/orcamento-publico";

type FormState = {
  name: string;
  phone: string;
  email: string;
  projectTypes: string[];
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  projectTypes: ["Cozinha Planejada"],
  message: "",
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleProjectType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter((t) => t !== type)
        : [...prev.projectTypes, type],
    }));
  };

  const validateField = (
    field: keyof FormState,
    values: FormState
  ): string | undefined => {
    switch (field) {
      case "name":
        return !values.name.trim() ? "Informe o seu nome." : undefined;
      case "phone":
        return values.phone.replace(/\D/g, "").length < 10
          ? "Informe um telefone válido com DDD."
          : undefined;
      case "email":
        return values.email.trim() && !isValidEmail(values.email)
          ? "Informe um e-mail válido."
          : undefined;
      case "message":
        return !values.message.trim()
          ? "Conte um pouco sobre o seu projeto."
          : undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setErrors((prev) => ({ ...prev, [field]: validateField(field, form) }));
  };

  const validate = (): boolean => {
    const fields: (keyof FormState)[] = ["name", "phone", "message", "email"];
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    for (const field of fields) {
      const error = validateField(field, form);
      if (error) nextErrors[field] = error;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const lines = [
      "Olá! Vim pelo site da MS Móveis Sob Medida e gostaria de solicitar um orçamento.",
      "",
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      ...(form.email.trim() ? [`E-mail: ${form.email}`] : []),
      `Tipo de projeto: ${form.projectTypes.join(", ") || "—"}`,
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
      tipoProjeto: form.projectTypes,
      mensagem: form.message,
    })
      .catch(() => {
        // Best-effort: se o registro no painel falhar, o fluxo de WhatsApp
        // já aconteceu e o cliente não deve perceber nenhuma diferença.
      })
      .finally(() => setIsSubmitting(false));
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
          onBlur={() => handleBlur("name")}
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
            onBlur={() => handleBlur("phone")}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
            placeholder="(47) 99999-8888"
          />
          {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-1.5">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
            placeholder="seuemail@exemplo.com"
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Tipo de projeto (selecione um ou mais)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {projectTypes.map((type) => {
            const checked = form.projectTypes.includes(type);
            return (
              <label
                key={type}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                  checked
                    ? "border-wood-500 bg-wood-50 text-wood-700"
                    : "border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleProjectType(type)}
                  className="h-4 w-4 rounded border-charcoal-300 text-wood-500 focus:ring-wood-200"
                />
                {type}
              </label>
            );
          })}
        </div>
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
          onBlur={() => handleBlur("message")}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          placeholder="Conte um pouco sobre o ambiente que deseja planejar..."
        />
        {errors.message && <p className="mt-1.5 text-sm text-red-600">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-wood-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            Enviando...
            <Loader2 size={16} className="animate-spin" />
          </>
        ) : (
          <>
            Enviar via WhatsApp
            <Send size={16} />
          </>
        )}
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
