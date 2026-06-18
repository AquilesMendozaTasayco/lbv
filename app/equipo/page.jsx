"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Search, Building } from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/ui/PageHero";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function EquipoPage() {
  const [miembros, setMiembros] = useState([]);
  const [especialidades, setEspecialidades] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [espFiltro, setEspFiltro] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eqSnap, espSnap] = await Promise.all([
          getDocs(query(collection(db, "equipo"), orderBy("orden", "asc"))),
          getDocs(query(collection(db, "servicios"), orderBy("orden", "asc"))),
        ]);

        const espMap = {};
        espSnap.docs.forEach(d => { espMap[d.id] = d.data().titulo; });
        setEspecialidades(espMap);

        const items = eqSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(m => m.activo !== false)
          .map(m => ({
            id: m.id,
            nombre: m.nombre,
            cargo: m.cargo || "",
            foto: m.foto || "",
            especialidades: m.especialidades || [],
            slug: slugify(m.nombre) + "-" + m.id.slice(0, 8),
          }));
        setMiembros(items);
      } catch { setMiembros([]); }
      finally { setLoaded(true); }
    };
    fetchData();
  }, []);

  const filtrados = miembros.filter(m => {
    const matchNombre = m.nombre.toLowerCase().includes(search.toLowerCase());
    const matchEsp = !espFiltro || m.especialidades.includes(espFiltro);
    return matchNombre && matchEsp;
  });

  const especialidadesList = Object.entries(especialidades).map(([id, nombre]) => ({ id, nombre }));

  return (
    <>
      <PageHero
        title="Equipo"
        subtitle="Conozca a los profesionales que conforman LBV Abogados"
        bgImage="/images/img8.jpg"
      />

      <section className="py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10 md:mb-12"
          >
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <div>
                <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight">
                  Nuestro Equipo
                </h2>
                <p className="font-sans text-[10px] sm:text-xs md:text-sm text-text/60 mt-2">
                  Profesionales altamente capacitados en cada rama del derecho.
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/30" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full rounded-sm border border-primary/10 bg-bg-alt pl-9 pr-4 py-2.5 font-sans text-xs text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30"
                />
              </div>
            </div>

            {especialidadesList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                <button
                  onClick={() => setEspFiltro("")}
                  className={`px-4 py-2 rounded-sm font-sans text-[9px] font-bold uppercase tracking-wider transition-all ${
                    !espFiltro ? "bg-accent text-primary" : "bg-bg-alt text-text/50 hover:text-accent border border-primary/10"
                  }`}
                >
                  Todos
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
          </motion.div>

          {!loaded ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-sm border border-primary/10 bg-white animate-pulse">
                  <div className="aspect-[4/5] bg-primary/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-primary/5 rounded-sm" />
                    <div className="h-3 w-1/2 bg-primary/5 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-20">
              <Users size={56} className="mx-auto mb-4 text-text/20" />
              <p className="font-sans text-sm text-text/40">No se encontraron miembros</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtrados.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
                >
                  <Link
                    href={`/equipo/${m.slug}`}
                    className="group flex flex-col rounded-sm border border-primary/10 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-bg-alt shrink-0">
                      {m.foto ? (
                        <img src={m.foto} alt={m.nombre} className="h-full w-full object-contain bg-bg-alt transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Users size={48} className="text-text/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
                      <div>
                        <h3 className="font-sans text-sm md:text-base font-bold text-primary group-hover:text-accent transition-colors">
                          {m.nombre}
                        </h3>
                        {m.cargo && (
                          <p className="font-sans text-[10px] md:text-xs text-text/50 mt-0.5">{m.cargo}</p>
                        )}
                      </div>
                      {m.especialidades.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {m.especialidades.slice(0, 2).map(e => (
                            <span key={e} className="rounded-sm bg-accent/10 px-2 py-0.5 font-sans text-[7px] text-accent font-semibold uppercase tracking-wider">
                              {especialidades[e] || ""}
                            </span>
                          ))}
                          {m.especialidades.length > 2 && (
                            <span className="rounded-sm bg-bg-alt px-2 py-0.5 font-sans text-[7px] text-text/40">
                              +{m.especialidades.length - 2}
                            </span>
                          )}
                        </div>
                      )}
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
