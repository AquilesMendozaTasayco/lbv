"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function EquipoPreview() {
  const [miembros, setMiembros] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "equipo"), orderBy("orden", "asc"), limit(4))
        );
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(m => m.activo !== false)
          .map(m => ({
            id: m.id,
            nombre: m.nombre,
            cargo: m.cargo || "",
            foto: m.foto || "",
            slug: slugify(m.nombre) + "-" + m.id.slice(0, 8),
          }));
        setMiembros(list);
      } catch { setMiembros([]); }
      finally { setLoaded(true); }
    };
    fetchData();
  }, []);

  if (!loaded) return null;
  if (!miembros.length) return null;

  return (
    <section className="bg-white py-12 md:py-16 xl:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 md:mb-12 text-center">
          <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
            Profesionales
          </span>
          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 leading-tight">
            Nuestro Equipo
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {miembros.map((m, i) => (
            <Link
              key={m.id}
              href={`/equipo/${m.slug}`}
              className="group rounded-sm border border-primary/10 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="aspect-[4/5] overflow-hidden bg-bg-alt">
                {m.foto ? (
                  <img src={m.foto} alt={m.nombre} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Users size={48} className="text-text/20" />
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="font-sans text-sm font-bold text-primary group-hover:text-accent transition-colors">
                  {m.nombre}
                </h3>
                {m.cargo && (
                  <p className="font-sans text-[10px] text-text/50 mt-0.5">{m.cargo}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/equipo"
            className="inline-flex items-center gap-2 border-2 border-primary bg-primary text-white px-5 md:px-6 py-2.5 md:py-3 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-primary active:scale-95"
          >
            Conoce a todo el equipo
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
