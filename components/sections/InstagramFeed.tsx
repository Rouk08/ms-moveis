import Image from "next/image";
import { company, portfolio } from "@/lib/data";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";

// TODO: configurar a Instagram Graph API (com um token da conta comercial
// @msmoveissobmedida) para puxar as últimas postagens reais em vez das
// imagens do portfólio usadas como placeholder abaixo.
const placeholderPosts = portfolio.slice(0, 8);

export default function InstagramFeed() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Instagram"
          title="Acompanhe nosso trabalho"
          description="Bastidores, projetos concluídos e inspirações direto do nosso perfil."
        />
        <AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {placeholderPosts.map((post) => (
              <a
                key={post.title}
                href={company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver "${post.title}" no Instagram`}
                className="group relative aspect-square overflow-hidden rounded-xl bg-charcoal-100"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal-900/0 group-hover:bg-charcoal-900/50 transition-colors duration-300">
                  <InstagramIcon
                    size={26}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </a>
            ))}
          </div>
        </AnimatedSection>
        <div className="mt-8 text-center">
          <a
            href={company.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 px-6 py-3 text-sm font-semibold text-charcoal-700 hover:bg-charcoal-50 transition-colors"
          >
            <InstagramIcon size={16} />
            Seguir @msmoveissobmedida
          </a>
        </div>
      </div>
    </section>
  );
}
