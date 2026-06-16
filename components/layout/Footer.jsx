"use client";

import Link from "next/link";
import { FaTiktok, FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa6";
import { useContacto } from "@/hooks/useContacto";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

export default function Footer() {
  const { data } = useContacto();

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:py-12 xl:py-16">
        <div className="grid gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="/logo.png"
              alt="LBV Abogados"
              className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 2xl:h-14 w-auto mb-3 md:mb-4 brightness-0 invert"
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
                  href={`tel:${data.telefono?.replace(/\s/g, "")}`}
                  className="transition-colors duration-300 hover:text-accent"
                >
                  {data.telefono || "+51 989 592 806"}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${data.email}`}
                  className="transition-colors duration-300 hover:text-accent"
                >
                  {data.email || "contacto@lbvabogados.pe"}
                </a>
              </li>
              <li>{data.direccion ? `${data.direccion}, ${data.ciudad}` : "Av. Principal 1234, San Isidro, Lima"}</li>
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

          <div>
            <h3 className="font-sans text-sm md:text-base xl:text-lg font-semibold mb-3 md:mb-4">
              Síguenos
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.tiktok && (
                <a href={data.tiktok} target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-300 hover:bg-accent hover:text-primary hover:scale-110"
                  aria-label="TikTok">
                  <FaTiktok size={18} />
                </a>
              )}
              {data.linkedin && (
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-300 hover:bg-accent hover:text-primary hover:scale-110"
                  aria-label="LinkedIn">
                  <FaLinkedinIn size={18} />
                </a>
              )}
              {data.instagram && (
                <a href={data.instagram} target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-300 hover:bg-accent hover:text-primary hover:scale-110"
                  aria-label="Instagram">
                  <FaInstagram size={18} />
                </a>
              )}
              {data.facebook && (
                <a href={data.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-300 hover:bg-accent hover:text-primary hover:scale-110"
                  aria-label="Facebook">
                  <FaFacebookF size={18} />
                </a>
              )}
            </div>
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
