"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building, Users, Briefcase, Shield, Scale,
  FileText, Gavel, Landmark, ArrowRight, Check,
} from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/ui/PageHero";

const ICONS = {
  Building, Users, Briefcase, Shield, Scale,
  Gavel, FileText, Landmark,
};

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

  if (!loaded || areas.length === 0) return null;

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
            <div className="mx-auto flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-accent/10">
              <Scale className="h-6 w-6 md:h-7 md:w-7 text-accent" />
            </div>
            <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
              Nuestra Experiencia
            </span>
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 leading-tight">
              Áreas de práctica
            </h2>
            <p className="font-sans text-[10px] sm:text-xs md:text-sm text-text/60 max-w-xl mx-auto mt-3 leading-relaxed">
              Contamos con un equipo multidisciplinario listo para brindarle la mejor asesoría en cada rama del derecho.
            </p>
          </motion.div>

          {areas.length === 0 ? (
            <div className="text-center py-20">
              <Building size={56} className="mx-auto mb-4 text-text/20" />
              <p className="font-sans text-sm text-text/40">No hay servicios disponibles</p>
            </div>
          ) : (
          <div className="space-y-12 md:space-y-20">
            {areas.map((area, i) => {
              const Icon = area.icon;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
                >
                  <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                    {/* TEXT */}
                    <div className={`relative ${isEven ? "" : "lg:order-2"}`}>
                      <div className="absolute left-0 top-0 h-full w-0.5 bg-accent/40 rounded-full hidden md:block" />
                      <div className="md:pl-6">
                        {area.tag && (
                          <span className="font-sans text-[7px] md:text-[8px] uppercase tracking-[0.25em] text-accent font-semibold bg-accent/10 px-3 py-1 rounded-full inline-block mb-3">
                            {area.tag}
                          </span>
                        )}
                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                          <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full bg-accent/10 shadow-sm">
                            <Icon className="h-6 w-6 md:h-7 md:w-7 text-accent" />
                          </div>
                          <h3 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight">
                            {area.title}
                          </h3>
                        </div>
                        <p className="font-sans text-[10px] sm:text-xs md:text-sm text-text/70 leading-relaxed mb-5 md:mb-6">
                          {area.desc}
                        </p>
                        {area.items.length > 0 && (
                          <ul className="space-y-2.5 md:space-y-3">
                            {area.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-5 w-5 md:h-6 md:w-6 shrink-0 items-center justify-center rounded-full bg-accent/10">
                                  <Check className="h-3 w-3 md:h-3.5 md:w-3.5 text-accent" />
                                </div>
                                <span className="font-sans text-[10px] sm:text-xs md:text-sm text-text/70 leading-relaxed pt-0.5">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* IMAGE */}
                    <div className={`relative ${isEven ? "" : "lg:order-1"}`}>
                      {area.bg ? (
                        <div className="group relative overflow-hidden rounded-sm shadow-lg">
                          <div
                            className="aspect-[16/12] bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${area.bg})` }}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${area.color} opacity-60`} />
                          <div className="absolute inset-0 border border-primary/10 rounded-sm pointer-events-none" />
                          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                            {area.tag && (
                              <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-white/80 font-semibold">
                                {area.tag}
                              </span>
                            )}
                            <h4 className="font-sans text-sm sm:text-base md:text-lg font-bold text-white mt-0.5">
                              {area.title}
                            </h4>
                          </div>
                        </div>
                      ) : (
                        <div className="flex aspect-[16/12] items-center justify-center rounded-sm bg-bg-alt border border-primary/10">
                          <Icon size={64} className="text-text/20" />
                        </div>
                      )}
                    </div>
                  </div>
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
