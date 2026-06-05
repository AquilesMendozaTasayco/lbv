"use client";

import { useState, useEffect, useCallback } from "react";

import { ChevronLeft, ChevronRight, ArrowRight, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const fallbackSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80",
    title: "Excelencia Legal a su Servicio",
    description:
      "Asesoría legal integral en derecho administrativo, civil, laboral y penal. Soluciones eficientes y personalizadas para cada caso.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
    title: "Confianza y Seguridad Jurídica",
    description:
      "Protegemos sus intereses con un enfoque estratégico y ético. Cada caso tratado con la seriedad y confidencialidad que usted merece.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=1920&q=80",
    title: "Soluciones Legales Integrales",
    description:
      "Todas las ramas del derecho con un equipo multidisciplinario. Representación legal sólida y resultados concretos.",
  },
];

export default function Hero() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(collection(db, "banners"), orderBy("orden", "asc"));
        const snap = await getDocs(q);
        const items = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(b => b.activo !== false)
          .map(b => ({
            id: b.id,
            image: b.imagen,
            title: [b.titulo, b.tituloDestacado].filter(Boolean).join(" "),
            description: b.subtitulo || "",
            cta: b.textoCta ? { text: b.textoCta, link: b.linkCta || "/contacto" } : null,
          }));
        if (items.length > 0) setSlides(items);
      } catch {
        // fallback mantiene slides por defecto
      }
    };
    fetchBanners();
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative h-dvh min-h-[500px] sm:min-h-[550px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-lg md:max-w-xl lg:max-w-2xl"
          >
            <div className="mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-accent/20 backdrop-blur-sm border border-accent/40">
                <Scale className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              </div>
              <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-accent font-semibold">
                Estudio Jurídico
              </span>
            </div>

            <h1 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg leading-tight">
              {slide.title}
            </h1>

            <p className="font-sans text-[10px] sm:text-xs md:text-sm lg:text-base text-white/80 leading-relaxed mb-3 md:mb-4 drop-shadow-md max-w-lg">
              {slide.description}
            </p>

            <a
              href={slide.cta?.link || "/contacto"}
              className="inline-flex items-center gap-1.5 bg-accent text-primary px-4 md:px-6 py-2 md:py-2.5 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white active:scale-95 shadow-lg shadow-accent/30"
            >
              {slide.cta?.text || "Contáctenos"}
              <ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-2 md:left-6 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:bg-white/30"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-2 md:right-6 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:bg-white/30"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-6 md:bottom-10 left-4 sm:left-6 lg:left-8 z-20 flex items-center gap-2 md:gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-6 md:w-8 h-1.5 md:h-2 bg-accent"
                : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
        <span className="font-sans text-[9px] md:text-xs text-white/40 ml-2 tracking-wider">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
