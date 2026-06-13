"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building, Users, Briefcase, Shield, Scale,
  FileText, Gavel, Landmark, ArrowRight,
} from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/ui/PageHero";

const ICONS = {
  Building, Users, Briefcase, Shield, Scale,
  Gavel, FileText, Landmark,
};

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function ServiciosPage() {
  const [areas, setAreas] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const q = query(collection(db, "servicios"), orderBy("orden", "asc"));
        const snap = await getDocs(q);
        const items = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(s => s.activo !== false)
          .map(s => ({
            icon: ICONS[s.icono] || Building,
            title: s.titulo,
            tag: s.tag || "",
            desc: s.desc || "",
            items: s.items || [],
            bg: s.imagen || "",
            color: s.color || "from-blue-900/80 to-blue-800/40",
            slug: slugify(s.titulo),
          }));
        setAreas(items);
      } catch {
        setAreas([]);
      } finally {
        setLoaded(true);
      }
    };
    fetchServicios();
  }, []);

  return (
    <>
      <PageHero
        title="Servicios"
        subtitle="Conozca nuestras áreas de práctica y el alcance de nuestra asesoría legal especializada"
        bgImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <section className="py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10 md:mb-16 text-center"
          >
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 leading-tight">
              Áreas de práctica
            </h2>
            <p className="font-sans text-[10px] sm:text-xs md:text-sm text-text/60 max-w-xl mx-auto mt-3 leading-relaxed">
              Contamos con un equipo multidisciplinario listo para brindarle la mejor asesoría en cada rama del derecho.
            </p>
          </motion.div>

          {!loaded ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-sm border border-primary/10 bg-white animate-pulse">
                  <div className="h-44 bg-primary/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-10 w-10 rounded-full bg-primary/5" />
                    <div className="h-4 w-3/4 bg-primary/5 rounded-sm" />
                    <div className="h-3 w-full bg-primary/5 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : areas.length === 0 ? (
            <div className="text-center py-20">
              <Building size={56} className="mx-auto mb-4 text-text/20" />
              <p className="font-sans text-sm text-text/40">No hay servicios disponibles</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {areas.map((area, i) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={area.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
                  >
                    <Link
                      href={`/servicios/${area.slug}`}
                      className="group relative block overflow-hidden rounded-sm border border-primary/10 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      {area.bg ? (
                        <div className="relative h-44 overflow-hidden">
                          <div
                            className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url(${area.bg})` }}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${area.color} opacity-60`} />
                        </div>
                      ) : (
                        <div className="flex h-44 items-center justify-center bg-bg-alt">
                          <Icon size={64} className="text-text/20" />
                        </div>
                      )}

                      <div className="p-5 md:p-6">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <Icon className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="font-sans text-sm md:text-base font-bold text-primary">
                          {area.title}
                        </h3>
                      </div>

                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/95 via-primary/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="p-5 md:p-6">
                          <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-accent font-semibold">
                            {area.tag}
                          </span>
                          <p className="font-sans text-[10px] md:text-xs text-white/80 leading-relaxed mt-1 line-clamp-3">
                            {area.desc}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 font-sans text-[9px] font-bold uppercase tracking-wider text-accent">
                            Ver más <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-14 md:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8"
          >
            <div className="text-center md:text-left">
              <h2 className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2">
                ¿Necesita asesoría legal?
              </h2>
              <p className="font-sans text-[10px] sm:text-xs md:text-sm text-white/60 max-w-lg leading-relaxed">
                Contáctenos hoy y agende una consulta con nuestros especialistas en el área que requiera.
              </p>
            </div>
            <Link
              href="/contacto"
              className="inline-flex shrink-0 items-center gap-2 bg-accent text-primary px-5 md:px-7 py-2.5 md:py-3.5 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white active:scale-95 shadow-lg"
            >
              Solicitar consulta
              <ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
