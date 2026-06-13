"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, FileText, Newspaper, Briefcase, Users, ArrowRight, Calendar } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/ui/PageHero";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState({ publicaciones: [], noticias: [], servicios: [], equipo: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!q.trim()) { setLoaded(true); return; }
    const fetchAll = async () => {
      try {
        const [pubSnap, notSnap, servSnap, eqSnap] = await Promise.all([
          getDocs(query(collection(db, "publicaciones"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "noticias"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "servicios"), orderBy("orden", "asc"))),
          getDocs(query(collection(db, "equipo"), orderBy("orden", "asc"))),
        ]);
        const queryText = q.toLowerCase();
        const filter = (arr, fields) =>
          arr.filter(item => fields.some(f => item[f]?.toLowerCase().includes(queryText)));
        const allData = {
          publicaciones: pubSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.activo !== false),
          noticias: notSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.activo !== false),
          servicios: servSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.activo !== false),
          equipo: eqSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.activo !== false),
        };
        setResults({
          publicaciones: filter(allData.publicaciones, ["titulo", "descripcion", "contenido"]),
          noticias: filter(allData.noticias, ["titulo", "descripcion", "contenido"]),
          servicios: filter(allData.servicios, ["titulo", "desc", "tag"]),
          equipo: filter(allData.equipo, ["nombre", "cargo", "descripcion"]),
        });
      } catch { /* */ }
      finally { setLoaded(true); }
    };
    fetchAll();
  }, [q]);

  const totalResults = results.publicaciones.length + results.noticias.length + results.servicios.length + results.equipo.length;

  const sections = [
    {
      key: "publicaciones", icon: FileText, label: "Publicaciones", color: "text-accent",
      items: results.publicaciones, path: (item) => `/publicaciones/${slugify(item.titulo)}-${item.id?.slice(0, 8)}`,
      titleField: "titulo", descField: "descripcion",
    },
    {
      key: "noticias", icon: Newspaper, label: "Noticias", color: "text-blue-400",
      items: results.noticias, path: (item) => `/noticias/${slugify(item.titulo)}-${item.id?.slice(0, 8)}`,
      titleField: "titulo", descField: "descripcion",
    },
    {
      key: "servicios", icon: Briefcase, label: "Servicios", color: "text-emerald-400",
      items: results.servicios, path: (item) => `/servicios/${slugify(item.titulo)}`,
      titleField: "titulo", descField: "desc",
    },
    {
      key: "equipo", icon: Users, label: "Equipo", color: "text-amber-400",
      items: results.equipo, path: (item) => `/equipo/${slugify(item.nombre)}-${item.id?.slice(0, 8)}`,
      titleField: "nombre", descField: "cargo",
    },
  ];

  return (
    <>
      <PageHero
        title="Resultados de búsqueda"
        subtitle={q ? `Mostrando resultados para "${q}"` : "Ingrese un término de búsqueda"}
        bgImage="/images/img7.jpg"
      />

      <section className="py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {!loaded ? (
            <div className="space-y-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="animate-pulse space-y-3">
                  <div className="h-5 w-32 bg-primary/5 rounded-sm" />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((c) => (
                      <div key={c} className="rounded-sm border border-primary/10 bg-white p-5 space-y-2">
                        <div className="h-4 w-3/4 bg-primary/5 rounded-sm" />
                        <div className="h-3 w-full bg-primary/5 rounded-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : !q.trim() ? (
            <div className="text-center py-20">
              <Search size={56} className="mx-auto mb-4 text-text/20" />
              <p className="font-sans text-sm text-text/40">Ingrese un término de búsqueda para comenzar</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-20">
              <Search size={56} className="mx-auto mb-4 text-text/20" />
              <p className="font-sans text-sm text-text/40">No se encontraron resultados para &quot;{q}&quot;</p>
              <p className="font-sans text-[10px] text-text/30 mt-2">Intente con otros términos</p>
            </div>
          ) : (
            <div className="space-y-10">
              {sections.map(({ key, icon: Icon, label, color, items, path, titleField, descField }) => {
                if (!items.length) return null;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Icon size={16} className={color} />
                      <h2 className="font-sans text-sm md:text-base font-bold text-primary">{label}</h2>
                      <span className="font-sans text-[10px] text-text/30">({items.length})</span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => (
                        <Link
                          key={item.id}
                          href={path(item)}
                          className="group rounded-sm border border-primary/10 bg-white p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                          <div className="flex items-start gap-3">
                            <Icon size={14} className={`${color} shrink-0 mt-0.5`} />
                            <div className="min-w-0 flex-1">
                              <h3 className="font-sans text-xs md:text-sm font-bold text-primary group-hover:text-accent transition-colors leading-snug">
                                {item[titleField]}
                              </h3>
                              {item[descField] && (
                                <p className="font-sans text-[9px] md:text-[10px] text-text/50 mt-1 line-clamp-2 leading-relaxed">
                                  {item[descField]}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-end">
                            <span className="inline-flex items-center gap-1 font-sans text-[8px] font-bold uppercase tracking-wider text-accent group-hover:gap-2 transition-all">
                              Ver más <ArrowRight size={9} />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><p className="font-sans text-sm text-text/40">Cargando...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
