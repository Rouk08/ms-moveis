import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { company } from "@/lib/data";
import ContactForm from "@/components/ContactForm";
import AnimatedSection from "@/components/AnimatedSection";
import { InstagramIcon } from "@/components/icons/SocialIcons";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com a MS Móveis Sob Medida em Gaspar/SC. Solicite um orçamento para o seu móvel planejado sob medida via formulário, telefone ou WhatsApp.",
  alternates: {
    canonical: "/contato",
  },
};

const infoItems = [
  {
    icon: MapPin,
    title: "Endereço",
    lines: [company.address.street, `${company.address.neighborhood}, ${company.address.city}/${company.address.state}`],
  },
  {
    icon: Phone,
    title: "Telefone / WhatsApp",
    lines: [company.phone.display, company.whatsapp.display],
  },
  {
    icon: Mail,
    title: "E-mail",
    lines: [company.email],
  },
  {
    icon: Clock,
    title: "Horário de atendimento",
    lines: company.hours.map((h) => `${h.day}: ${h.time}`),
  },
];

export default function ContatoPage() {
  return (
    <>
      <section className="pt-36 pb-16 sm:pt-40 sm:pb-20 bg-charcoal-50/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-wood-600 mb-3">
            Contato
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-charcoal-800">
            Vamos planejar o seu próximo móvel?
          </h1>
          <p className="mt-5 text-lg text-charcoal-500 leading-relaxed">
            Preencha o formulário, ligue ou chame no WhatsApp. Atendemos
            Gaspar, Blumenau, Brusque e todo o Vale do Itajaí.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <AnimatedSection className="lg:col-span-3">
            <div className="rounded-2xl border border-charcoal-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-charcoal-800 mb-6">
                Solicite seu orçamento
              </h2>
              <ContactForm />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="lg:col-span-2">
            <div className="space-y-6">
              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wood-100 text-wood-600">
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="font-semibold text-charcoal-800">{item.title}</p>
                      {item.lines.map((line) => (
                        <p key={line} className="text-sm text-charcoal-500">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}

              <a
                href={`https://wa.me/${company.whatsapp.raw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-wood-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 transition-colors"
              >
                <MessageCircle size={18} />
                Conversar no WhatsApp
              </a>

              <div className="flex items-center justify-center gap-3">
                <a
                  href={company.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da MS Móveis"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal-200 text-charcoal-600 hover:bg-wood-50 hover:text-wood-600 hover:border-wood-200 transition-colors"
                >
                  <InstagramIcon size={18} />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="overflow-hidden rounded-2xl border border-charcoal-100 shadow-sm">
            <iframe
              title={`Mapa - ${company.address.full}`}
              src={company.mapEmbedSrc}
              className="h-96 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
