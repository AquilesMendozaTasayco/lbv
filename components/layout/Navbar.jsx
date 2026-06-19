"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SearchOverlay from "./SearchOverlay";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const links = [
  { href: "/", label: "Inicio" },
  {
    href: "/nosotros", label: "Nosotros",
    subItems: [
      { href: "/nosotros#historia", label: "Historia" },
      { href: "/nosotros#filosofia", label: "Filosofía" },
      { href: "/nosotros#valores", label: "Valores" },
    ],
  },
  {
    href: "/equipo", label: "Equipo",
    subItems: [
      { href: "/equipo#nuestro-equipo", label: "Nuestro Equipo" },
      { href: "/equipo#unete-al-equipo", label: "Únete a nuestro equipo" },
    ],
  },
  { href: "/servicios", label: "Servicios" },
  { href: "/noticias", label: "Noticias" },
  { href: "/publicaciones", label: "Publicaciones" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [serviciosSub, setServiciosSub] = useState([]);
  const pathname = usePathname();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const q = query(collection(db, "servicios"), orderBy("orden", "asc"));
        const snap = await getDocs(q);
        const items = snap.docs
          .map(d => d.data())
          .filter(s => s.activo !== false)
          .map(s => ({ href: "/servicios/" + slugify(s.titulo), label: s.titulo }));
        setServiciosSub(items);
      } catch { /* */ }
    };
    fetchServicios();
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
          {links.map(({ href, label, subItems }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            const items = href === "/servicios" && serviciosSub.length > 0 ? serviciosSub : subItems;
            return (
              <li key={href} className="group relative">
                <Link
                  href={href}
                  className="relative font-sans text-[8px] lg:text-[9px] xl:text-[10px] 2xl:text-xs font-semibold uppercase tracking-[0.08em] lg:tracking-[0.1em] xl:tracking-[0.12em] 2xl:tracking-[0.15em] transition-colors duration-300"
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
                {items && (
                  <div className="pointer-events-none absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="min-w-[180px] rounded-sm bg-primary border border-white/10 shadow-xl shadow-black/30">
                      {items.map(sub => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-5 py-2.5 font-sans text-[9px] xl:text-[10px] font-semibold uppercase tracking-wider text-white/70 hover:text-accent hover:bg-white/5 transition-all duration-200 first:rounded-t-sm last:rounded-b-sm"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
              {links.map(({ href, label, subItems }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                const items = href === "/servicios" && serviciosSub.length > 0 ? serviciosSub : subItems;
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
                    {items && (
                      <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
                        {items.map(sub => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className="block font-sans text-[9px] md:text-[10px] font-semibold uppercase tracking-wider text-white/50 hover:text-accent transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
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
