"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, ArrowRight, Calendar } from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function UltimasPublicaciones() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "publicaciones"), orderBy("createdAt", "desc"), limit(2))
        );
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.activo !== false)
          .map(p => ({
            id: p.id,
            titulo: p.titulo,
            descripcion: p.descripcion || "",
            imagen: p.imagen || "",
            slug: slugify(p.titulo) + "-" + p.id.slice(0, 8),
            createdAt: p.createdAt,
          }));
        setItems(list);
      } catch { setItems([]); }
      finally { setLoaded(true); }
    };
    fetchData();
  }, []);

  if (!loaded) {
    return (
      <section className="bg-white py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 md:mb-12 text-center">
            <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">Contenido Legal</span>
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 leading-tight">Últimas Publicaciones</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map(i => (
              <div key={i} className="rounded-sm border border-primary/10 bg-white animate-pulse">
                <div className="h-44 bg-primary/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 bg-primary/5 rounded-sm" />
                  <div className="h-3 w-full bg-primary/5 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 md:py-16 xl:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 md:mb-12 text-center">
          <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
            Contenido Legal
          </span>
          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 leading-tight">
            Últimas Publicaciones
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={48} className="mx-auto mb-4 text-text/20" />
            <p className="font-sans text-sm text-text/40">No hay publicaciones aún</p>
            <p className="font-sans text-[10px] text-text/30 mt-1">Pronto compartiremos contenido legal de interés.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((pub) => (
              <Link
                key={pub.id}
                href={`/publicaciones/${pub.slug}`}
                className="group rounded-sm border border-primary/10 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {pub.imagen ? (
                  <div className="h-44 overflow-hidden">
                    <img src={pub.imagen} alt={pub.titulo} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="flex h-44 items-center justify-center bg-bg-alt">
                    <FileText size={48} className="text-text/20" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-sans text-sm font-bold text-primary mb-1.5 leading-snug group-hover:text-accent transition-colors">
                    {pub.titulo}
                  </h3>
                  {pub.descripcion && (
                    <p className="font-sans text-[10px] text-text/60 leading-relaxed line-clamp-2">
                      {pub.descripcion}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 font-sans text-[9px] font-bold uppercase tracking-wider text-accent group-hover:gap-2 transition-all">
                      Leer más <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/publicaciones"
            className="inline-flex items-center gap-2 border-2 border-primary bg-primary text-white px-5 md:px-6 py-2.5 md:py-3 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-primary active:scale-95"
          >
            Ver todas las publicaciones
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
