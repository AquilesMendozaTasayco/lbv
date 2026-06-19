"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, FileText, Newspaper, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCached, setCache } from "@/lib/cache";
import Link from "next/link";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function buildSlug(item, collection) {
  const title = collection === "publicaciones" ? item.titulo : item.titulo;
  return `/${collection}/${slugify(title)}-${item.id.slice(0, 8)}`;
}

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = getCached("hero_slides");
    if (cached) { setSlides(cached); setLoading(false); return; }
    const fetchData = async () => {
      try {
        const [banSnap, pubSnap, notSnap] = await Promise.all([
          getDocs(query(collection(db, "banners"), orderBy("orden", "asc"))),
          getDocs(query(collection(db, "publicaciones"), orderBy("createdAt", "desc"), limit(2))),
          getDocs(query(collection(db, "noticias"), orderBy("createdAt", "desc"), limit(2))),
        ]);

        const banners = banSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(b => b.activo !== false)
          .map(b => ({
            type: "banner",
            image: b.imagen,
            title: [b.titulo, b.tituloDestacado].filter(Boolean).join(" "),
            description: b.subtitulo || "",
            link: b.linkCta || "/contacto",
            ctaText: b.textoCta || "Contáctenos",
            icon: Scale,
          }));

        const publicaciones = pubSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.activo !== false)
          .map(p => ({
            type: "publicacion",
            image: p.imagen || "/images/img1.jpg",
            title: p.titulo,
            description: p.descripcion || "",
            link: buildSlug(p, "publicaciones"),
            icon: FileText,
          }));

        const noticias = notSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(n => n.activo !== false)
          .map(n => ({
            type: "noticia",
            image: n.imagen || "/images/img1.jpg",
            title: n.titulo,
            description: n.descripcion || "",
            link: buildSlug(n, "noticias"),
            icon: Newspaper,
          }));

        const items = [...banners, ...publicaciones, ...noticias];
        setSlides(items);
        setCache("hero_slides", items);
      } catch {
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [paused, next, slides.length]);

  const slide = slides[current];
  const Icon = slide?.icon || FileText;

  if (loading) {
    return (
      <section className="relative h-dvh min-h-[500px] sm:min-h-[550px] w-full overflow-hidden bg-primary">
        <div className="absolute inset-0 animate-pulse bg-primary/80">
          <div className="h-full w-full bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl space-y-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/10 animate-pulse" />
              <div className="h-3 w-32 bg-white/10 animate-pulse rounded-sm" />
            </div>
            <div className="h-8 md:h-10 w-3/4 bg-white/10 animate-pulse rounded-sm" />
            <div className="h-8 md:h-10 w-1/2 bg-white/10 animate-pulse rounded-sm" />
            <div className="h-4 md:h-5 w-full max-w-md bg-white/10 animate-pulse rounded-sm" />
            <div className="h-4 md:h-5 w-3/4 max-w-sm bg-white/10 animate-pulse rounded-sm" />
            <div className="h-10 md:h-12 w-40 bg-white/10 animate-pulse rounded-sm" />
          </div>
        </div>
      </section>
    );
  }

  if (!slides.length) return null;

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
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-accent/20">
                <Icon className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              </div>
              <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                {slide.type === "banner" ? "LBV Abogados" : slide.type === "publicacion" ? "Publicación" : "Noticia"}
              </span>
            </div>

            <h1 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg leading-tight">
              {slide.title}
            </h1>

            {slide.description && (
              <p className="font-sans text-[10px] sm:text-xs md:text-sm lg:text-base text-white/80 leading-relaxed mb-3 md:mb-4 drop-shadow-md max-w-lg">
                {slide.description}
              </p>
            )}

            <Link
              href={slide.link}
              className="inline-flex items-center gap-1.5 bg-accent text-primary px-4 md:px-6 py-2 md:py-2.5 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white active:scale-95 shadow-lg shadow-accent/30"
            >
              {slide.ctaText || "Leer más"}
              <ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
            </Link>
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
        {slides.map((s, i) => (
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