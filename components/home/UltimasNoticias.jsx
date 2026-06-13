"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function UltimasNoticias() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "noticias"), orderBy("createdAt", "desc"), limit(3))
        );
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(n => n.activo !== false)
          .map(n => ({
            id: n.id,
            titulo: n.titulo,
            descripcion: n.descripcion || "",
            imagen: n.imagen || "",
            slug: slugify(n.titulo) + "-" + n.id.slice(0, 8),
            createdAt: n.createdAt,
          }));
        setItems(list);
      } catch { setItems([]); }
      finally { setLoaded(true); }
    };
    fetchData();
  }, []);

  if (!loaded) {
    return (
      <section className="bg-bg-alt py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 md:mb-12 text-center">
            <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">Novedades</span>
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 leading-tight">Últimas Noticias</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map(i => (
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
    <section className="bg-bg-alt py-12 md:py-16 xl:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 md:mb-12 text-center">
          <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
            Novedades
          </span>
          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 leading-tight">
            Últimas Noticias
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper size={48} className="mx-auto mb-4 text-text/20" />
            <p className="font-sans text-sm text-text/40">No hay noticias aún</p>
            <p className="font-sans text-[10px] text-text/30 mt-1">Pronto publicaremos novedades del estudio.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((noticia) => (
              <Link
                key={noticia.id}
                href={`/noticias/${noticia.slug}`}
                className="group rounded-sm border border-primary/10 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {noticia.imagen ? (
                  <div className="h-44 overflow-hidden">
                    <img src={noticia.imagen} alt={noticia.titulo} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="flex h-44 items-center justify-center bg-bg-alt">
                    <Newspaper size={48} className="text-text/20" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-sans text-sm font-bold text-primary mb-1.5 leading-snug group-hover:text-accent transition-colors">
                    {noticia.titulo}
                  </h3>
                  {noticia.descripcion && (
                    <p className="font-sans text-[10px] text-text/60 leading-relaxed line-clamp-2">
                      {noticia.descripcion}
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
            href="/noticias"
            className="inline-flex items-center gap-2 border-2 border-primary bg-primary text-white px-5 md:px-6 py-2.5 md:py-3 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-primary active:scale-95"
          >
            Ver todas las noticias
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
