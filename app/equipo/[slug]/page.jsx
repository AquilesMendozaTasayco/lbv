"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, FileText, Users } from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/ui/PageHero";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function AbogadoDetailPage() {
  const params = useParams();
  const [abogado, setAbogado] = useState(null);
  const [especialidades, setEspecialidades] = useState({});
  const [recomendados, setRecomendados] = useState([]);
  const [loaded, setLoaded] = useState(false);

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

        const todos = eqSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(m => m.activo !== false)
          .map(m => ({
            ...m,
            slug: slugify(m.nombre) + "-" + m.id.slice(0, 8),
          }));

        const found = todos.find(m => m.slug === params.slug);
        if (found) {
          setAbogado(found);
          setRecomendados(todos.filter(m => m.id !== found.id).slice(0, 4));
        }
      } catch { /* */ }
      finally { setLoaded(true); }
    };
    fetchData();
  }, [params.slug]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-sm border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!abogado) {
    return (
      <>
        <PageHero title="No encontrado" subtitle="El abogado no está disponible" bgImage="/images/img6.jpg" />
        <div className="py-20 text-center">
          <Users size={56} className="mx-auto mb-4 text-text/20" />
          <p className="font-sans text-sm text-text/40 mb-6">El abogado que buscas no existe.</p>
          <Link href="/equipo" className="inline-flex items-center gap-2 text-accent font-sans text-xs font-bold uppercase tracking-widest hover:underline">
            <ArrowLeft size={14} /> Volver al Equipo
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        title={abogado.nombre}
        subtitle={abogado.cargo || "LBV Abogados"}
        bgImage="/images/img8.jpg"
      />

      <section className="py-8 md:py-10 bg-bg-alt border-b border-primary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/equipo"
            className="inline-flex items-center gap-1.5 font-sans text-[10px] md:text-xs text-text/50 hover:text-accent transition-colors"
          >
            <ArrowLeft size={12} /> Volver al Equipo
          </Link>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-10 md:grid-cols-5"
          >
            {/* Left: Photo */}
            <div className="md:col-span-2">
              <div className="sticky top-24 aspect-[3/4] overflow-hidden rounded-sm bg-bg-alt border border-primary/10 shadow-lg">
                {abogado.foto ? (
                  <img src={abogado.foto} alt={abogado.nombre} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Users size={64} className="text-text/20" />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="md:col-span-3">
              <h1 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                {abogado.nombre}
              </h1>
              {abogado.cargo && (
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                  {abogado.cargo}
                </span>
              )}

              <div className="w-12 h-0.5 bg-accent my-5" />

              <div className="space-y-3 mb-6">
                {abogado.ciudad && (
                  <div className="flex items-center gap-3">
                    <MapPin size={14} className="text-accent shrink-0" />
                    <span className="font-sans text-xs md:text-sm text-text/70">{abogado.ciudad}</span>
                  </div>
                )}
                {abogado.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-accent shrink-0" />
                    <a href={`mailto:${abogado.email}`} className="font-sans text-xs md:text-sm text-accent hover:underline">{abogado.email}</a>
                  </div>
                )}
                {abogado.cv && (
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-accent shrink-0" />
                    <a href={abogado.cv} target="_blank" rel="noopener noreferrer" className="font-sans text-xs md:text-sm text-accent hover:underline font-semibold uppercase tracking-wider">
                      Ver CV
                    </a>
                  </div>
                )}
              </div>

              {abogado.especialidades?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {abogado.especialidades.map(e => (
                    <span key={e} className="rounded-sm bg-accent/10 px-3 py-1 font-sans text-[9px] font-semibold uppercase tracking-wider text-accent">
                      {especialidades[e] || ""}
                    </span>
                  ))}
                </div>
              )}

              {abogado.descripcion && (
                <div className="border-t border-primary/10 pt-6">
                  <p className="font-sans text-xs md:text-sm text-text/70 leading-relaxed whitespace-pre-line">
                    {abogado.descripcion}
                  </p>
                </div>
              )}

              {abogado.habilidades?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-primary mb-3">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {abogado.habilidades.map((h, i) => (
                      <span key={i} className="rounded-sm bg-bg-alt border border-primary/10 px-3 py-1.5 font-sans text-[10px] text-text/60">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {recomendados.length > 0 && (
        <section className="bg-bg-alt py-12 md:py-16 border-t border-primary/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-8 md:mb-10"
            >
              <h2 className="font-sans text-lg md:text-xl font-bold text-primary">
                Otros miembros del equipo
              </h2>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recomendados.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    href={`/equipo/${m.slug}`}
                    className="group block rounded-sm border border-primary/10 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-bg-alt">
                      {m.foto ? (
                        <img src={m.foto} alt={m.nombre} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Users size={36} className="text-text/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-sans text-xs md:text-sm font-bold text-primary group-hover:text-accent transition-colors">
                        {m.nombre}
                      </h3>
                      {m.cargo && (
                        <p className="font-sans text-[9px] text-text/50 mt-0.5">{m.cargo}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
