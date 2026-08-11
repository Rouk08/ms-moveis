import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import { company, services } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-charcoal-800 text-charcoal-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2 font-heading text-xl font-semibold text-white">
            <Image
              src="/logo.jpg"
              alt="MS Móveis"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            MS Móveis
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-300">
            Móveis planejados e sob medida em Gaspar/SC, atendendo Blumenau,
            Brusque e todo o Vale do Itajaí com projeto 3D personalizado,
            qualidade e garantia.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Link
              href={company.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da MS Móveis Sob Medida"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-700 hover:bg-wood-500 transition-colors"
            >
              <InstagramIcon size={16} />
            </Link>
            <Link
              href={company.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook da MS Móveis Sob Medida"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-700 hover:bg-wood-500 transition-colors"
            >
              <FacebookIcon size={16} />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-wood-300 mb-4">
            Navegação
          </h3>
          <ul className="space-y-3 text-sm text-charcoal-300">
            <li><Link href="/#sobre" className="hover:text-white transition-colors">Sobre</Link></li>
            <li><Link href="/servicos" className="hover:text-white transition-colors">Serviços</Link></li>
            <li><Link href="/#portfolio" className="hover:text-white transition-colors">Portfólio</Link></li>
            <li><Link href="/#depoimentos" className="hover:text-white transition-colors">Depoimentos</Link></li>
            <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-wood-300 mb-4">
            Serviços
          </h3>
          <ul className="space-y-3 text-sm text-charcoal-300">
            {services.slice(0, 5).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/servicos/${service.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-wood-300 mb-4">
            Contato
          </h3>
          <ul className="space-y-3 text-sm text-charcoal-300">
            <li className="flex gap-3">
              <MapPin size={18} className="shrink-0 text-wood-400" />
              <span>{company.address.full}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="shrink-0 text-wood-400" />
              <span>{company.phone.display} / {company.whatsapp.display}</span>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="shrink-0 text-wood-400" />
              <span>{company.email}</span>
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="shrink-0 text-wood-400" />
              <span>
                {company.hours.map((h) => `${h.day}: ${h.time}`).join(" · ")}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-charcoal-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-400">
          <p>
            © {new Date().getFullYear()} {company.name}. Todos os direitos
            reservados.
          </p>
          <p>Gaspar · Blumenau · Brusque · Vale do Itajaí — SC</p>
        </div>
      </div>
    </footer>
  );
}
