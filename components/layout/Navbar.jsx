"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "./SearchOverlay";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/equipo", label: "Equipo" },
  { href: "/servicios", label: "Servicios" },
  { href: "/noticias", label: "Noticias" },
  { href: "/publicaciones", label: "Publicaciones LBV" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-primary text-white shadow-lg shadow-black/10"
          : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:py-2 md:py-2 lg:py-2 xl:py-2.5 2xl:py-3">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/logo.png"
            alt="LBV Abogados"
            className="h-9 sm:h-10 md:h-12 lg:h-14 xl:h-16 2xl:h-18 w-auto brightness-0 invert"
          />
        </Link>

        <button
          className="flex items-center p-1.5 md:p-2 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <ul className="hidden items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-6 lg:flex">
          <li>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center p-1.5 text-white/70 hover:text-accent transition-colors"
              aria-label="Buscar"
            >
              <Search size={15} className="xl:h-4 xl:w-4 2xl:h-[18px] 2xl:w-[18px]" />
            </button>
          </li>
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="group relative font-sans text-[8px] lg:text-[9px] xl:text-[10px] 2xl:text-xs font-semibold uppercase tracking-[0.08em] lg:tracking-[0.1em] xl:tracking-[0.12em] 2xl:tracking-[0.15em] transition-colors duration-300"
                >
                  <span className={isActive ? "text-accent" : "text-white/90 group-hover:text-accent"}>
                    {label}
                  </span>
                  <span
                    className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-primary lg:hidden"
          >
            <ul className="flex flex-col px-4 py-3 gap-2">
              <li>
                <button
                  onClick={() => { setOpen(false); setSearchOpen(true); }}
                  className="flex w-full items-center gap-3 font-sans text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-accent transition-colors"
                >
                  <Search size={14} />
                  Buscar
                </button>
              </li>
              {links.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`block font-sans text-[10px] md:text-xs font-semibold uppercase tracking-widest transition-colors hover:text-accent ${
                        isActive ? "text-accent" : "text-white"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
