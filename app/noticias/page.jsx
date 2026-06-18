"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/ui/PageHero";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(query(collection(db, "noticias"), orderBy("orden", "asc")));
        const items = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(n => n.activo !== false)
          .map(n => ({
            id: n.id,
            titulo: n.titulo,
            descripcion: n.descripcion || "",
            contenido: n.contenido || "",
            imagen: n.imagen || "",
            slug: slugify(n.titulo) + "-" + n.id.slice(0, 8),
          }));
        setNoticias(items);
      } catch { setNoticias([]); }
      finally { setLoaded(true); }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageHero
        title="Noticias"
        subtitle="Manténgase informado sobre las actividades de LBV Abogados y acceda a artículos, análisis y comentarios elaborados por nuestros profesionales."
        bgImage="/images/img6.jpg"
      />

      <section className="py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
          ) : noticias.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper size={56} className="mx-auto mb-4 text-text/20" />
              <p className="font-sans text-sm text-text/40">No hay noticias disponibles</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {noticias.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
                >
                  <Link
                    href={`/noticias/${n.slug}`}
                    className="group block rounded-sm border border-primary/10 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {n.imagen ? (
                      <div className="h-48 overflow-hidden">
                        <img src={n.imagen} alt={n.titulo} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-bg-alt">
                        <Newspaper size={48} className="text-text/20" />
                      </div>
                    )}
                    <div className="p-5 md:p-6">
                      <h3 className="font-sans text-sm md:text-base font-bold text-primary mb-2 leading-snug group-hover:text-accent transition-colors">
                        {n.titulo}
                      </h3>
                      {n.descripcion && (
                        <p className="font-sans text-[10px] md:text-xs text-text/60 leading-relaxed line-clamp-2">
                          {n.descripcion}
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
