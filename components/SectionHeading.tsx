type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h2" | "h1";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as = "h2",
}: SectionHeadingProps) {
  const Heading = as;
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClass} mb-12`}>
      {eyebrow && (
        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-wood-600 mb-3">
          {eyebrow}
        </span>
      )}
      <Heading className="text-3xl sm:text-4xl font-semibold text-charcoal-800 mb-4">
        {title}
      </Heading>
      {description && (
        <p className="text-charcoal-500 text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
