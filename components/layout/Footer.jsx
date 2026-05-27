import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:py-12 xl:py-16">
        <div className="grid gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="/logo.png"
              alt="LBV Abogados"
              width={140}
              height={46}
              className="h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9 2xl:h-10 w-auto mb-3 md:mb-4 brightness-0 invert"
            />
            <p className="font-sans text-xs md:text-sm leading-relaxed text-white/60 max-w-xs">
              Estudio de abogados con amplia experiencia en derecho
              administrativo, civil, laboral y penal. Compromiso y excelencia
              legal.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-sm md:text-base xl:text-lg font-semibold mb-3 md:mb-4">
              Contacto
            </h3>
            <ul className="space-y-2 md:space-y-3 font-sans text-xs md:text-sm text-white/60">
              <li>
                <a
                  href="tel:+51999888777"
                  className="transition-colors duration-300 hover:text-accent"
                >
                  +51 999 888 777
                </a>
              </li>
              <li>
                <a
                  href="mailto:contacto@lbv.pe"
                  className="transition-colors duration-300 hover:text-accent"
                >
                  contacto@lbv.pe
                </a>
              </li>
              <li>Av. Principal 123, San Isidro, Lima</li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-sm md:text-base xl:text-lg font-semibold mb-3 md:mb-4">
              Enlaces
            </h3>
            <ul className="space-y-2 md:space-y-3 font-sans text-xs md:text-sm">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group relative text-white/60 transition-colors duration-300 hover:text-accent"
                  >
                    {label}
                    <span className="absolute -bottom-0.5 left-0 h-[1.5px] bg-accent w-0 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <p className="font-sans text-center text-[10px] md:text-xs text-white/40">
            &copy; {new Date().getFullYear()} LBV Abogados. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
