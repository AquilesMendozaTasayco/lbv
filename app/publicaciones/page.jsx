"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText, Calendar, ArrowRight, Building,
  Users, Briefcase, Shield, Scale, Gavel, FileText as FT, Landmark,
} from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/ui/PageHero";

const ICONS = {
  Building, Users, Briefcase, Shield, Scale,
  Gavel, FT, Landmark,
};

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function PublicacionesPage() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [especialidades, setEspecialidades] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [espFiltro, setEspFiltro] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pubSnap, espSnap] = await Promise.all([
          getDocs(query(collection(db, "publicaciones"), orderBy("orden", "asc"))),
          getDocs(query(collection(db, "servicios"), orderBy("orden", "asc"))),
        ]);

        const espMap = {};
        espSnap.docs.forEach(d => { espMap[d.id] = d.data().titulo; });
        setEspecialidades(espMap);

        const items = pubSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.activo !== false)
          .map(p => ({
            id: p.id,
            titulo: p.titulo,
            descripcion: p.descripcion || "",
            contenido: p.contenido || "",
            imagen: p.imagen || "",
            especialidad: p.especialidad || "",
            slug: slugify(p.titulo) + "-" + p.id.slice(0, 8),
            createdAt: p.createdAt,
          }));
        setPublicaciones(items);
      } catch { setPublicaciones([]); }
      finally { setLoaded(true); }
    };
    fetchData();
  }, []);

  const filtrados = espFiltro
    ? publicaciones.filter(p => p.especialidad === espFiltro)
    : publicaciones;

  const especialidadesList = Object.entries(especialidades).map(([id, nombre]) => ({ id, nombre }));

  return (
    <>
      <PageHero
        title="Publicaciones LBV"
        subtitle="Artículos, guías y análisis jurídicos elaborados por nuestro equipo de especialistas"
        bgImage="/images/img6.jpg"
      />

      <section className="py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10 md:mb-12 text-center"
          >
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 leading-tight">
              Publicaciones
            </h2>
            <p className="font-sans text-[10px] sm:text-xs md:text-sm text-text/60 max-w-xl mx-auto mt-3 leading-relaxed">
              Contenido legal de interés elaborado por nuestros especialistas.
            </p>
          </motion.div>

          {especialidadesList.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => setEspFiltro("")}
                className={`px-4 py-2 rounded-sm font-sans text-[9px] font-bold uppercase tracking-wider transition-all ${
                  !espFiltro ? "bg-accent text-primary" : "bg-bg-alt text-text/50 hover:text-accent border border-primary/10"
                }`}
              >
                Todas
              </button>
              {especialidadesList.map(({ id, nombre }) => (
                <button
                  key={id}
                  onClick={() => setEspFiltro(id)}
                  className={`px-4 py-2 rounded-sm font-sans text-[9px] font-bold uppercase tracking-wider transition-all ${
                    espFiltro === id ? "bg-accent text-primary" : "bg-bg-alt text-text/50 hover:text-accent border border-primary/10"
                  }`}
                >
                  {nombre}
                </button>
              ))}
            </div>
          )}

          {!loaded ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-sm border border-primary/10 bg-white animate-pulse">
                  <div className="h-48 bg-primary/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-3/4 bg-primary/5 rounded-sm" />
                    <div className="h-3 w-full bg-primary/5 rounded-sm" />
                    <div className="h-3 w-2/3 bg-primary/5 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={56} className="mx-auto mb-4 text-text/20" />
              <p className="font-sans text-sm text-text/40">No hay publicaciones disponibles</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtrados.map((pub, i) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
                >
                  <Link
                    href={`/publicaciones/${pub.slug}`}
                    className="group block rounded-sm border border-primary/10 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {pub.imagen ? (
                      <div className="h-48 overflow-hidden">
                        <img src={pub.imagen} alt={pub.titulo} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-bg-alt">
                        <FileText size={48} className="text-text/20" />
                      </div>
                    )}
                    <div className="p-5 md:p-6">
                      {pub.especialidad && especialidades[pub.especialidad] && (
                        <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 font-sans text-[8px] font-semibold uppercase tracking-wider text-accent mb-2">
                          {especialidades[pub.especialidad]}
                        </span>
                      )}
                      <h3 className="font-sans text-sm md:text-base font-bold text-primary mb-2 leading-snug group-hover:text-accent transition-colors">
                        {pub.titulo}
                      </h3>
                      {pub.descripcion && (
                        <p className="font-sans text-[10px] md:text-xs text-text/60 leading-relaxed line-clamp-2">
                          {pub.descripcion}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 font-sans text-[9px] font-bold uppercase tracking-wider text-accent group-hover:gap-2 transition-all">
                          Leer más <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
