"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";

// TODO: integrar com um provedor de e-mail marketing (Mailchimp, Brevo,
// etc.) — por enquanto o formulário é só interface, não envia os dados
// pra lugar nenhum.
export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 sm:py-24 bg-wood-500">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-white">
          Receba dicas e inspirações para seus ambientes
        </h2>
        <p className="mt-3 text-wood-100">
          Cadastre-se e receba novidades da MS Móveis por e-mail, sem spam.
        </p>

        {submitted ? (
          <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-white">
            <CheckCircle2 size={18} />
            Cadastro recebido! Em breve você recebe nossas novidades.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-7 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <label htmlFor="newsletter-name" className="sr-only">
              Nome
            </label>
            <input
              id="newsletter-name"
              type="text"
              required
              placeholder="Seu nome"
              className="w-full sm:w-48 rounded-full border-0 px-5 py-3 text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <label htmlFor="newsletter-email" className="sr-only">
              E-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Seu e-mail"
              className="w-full sm:w-64 rounded-full border-0 px-5 py-3 text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal-800 px-6 py-3 text-sm font-semibold text-white hover:bg-charcoal-900 transition-colors"
            >
              Cadastrar
              <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
