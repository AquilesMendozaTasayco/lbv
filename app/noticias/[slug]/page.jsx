"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/ui/PageHero";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function NoticiaDetailPage() {
  const params = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(query(collection(db, "noticias"), orderBy("orden", "asc")));
        const found = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .find(n => (slugify(n.titulo) + "-" + n.id.slice(0, 8)) === params.slug);
        if (found) setNoticia(found);
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

  if (!noticia) {
    return (
      <>
        <PageHero title="No encontrada" subtitle="La noticia no está disponible" bgImage="/images/img6.jpg" />
        <div className="py-20 text-center">
          <Newspaper size={56} className="mx-auto mb-4 text-text/20" />
          <p className="font-sans text-sm text-text/40 mb-6">La noticia que buscas no existe.</p>
          <Link href="/noticias" className="inline-flex items-center gap-2 text-accent font-sans text-xs font-bold uppercase tracking-widest hover:underline">
            <ArrowLeft size={14} /> Volver a Noticias
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        title={noticia.titulo}
        subtitle="Noticias LBV"
                bgImage={noticia.imagen || "/images/img6.jpg"}
      />

      <section className="py-8 md:py-10 border-b border-primary/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1.5 font-sans text-[10px] md:text-xs text-text/50 hover:text-accent transition-colors"
          >
            <ArrowLeft size={12} /> Volver a Noticias
          </Link>
        </div>
      </section>

      <article className="py-10 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {noticia.descripcion && (
              <p className="font-sans text-sm md:text-base text-text/60 leading-relaxed mb-8 italic border-l-2 border-accent/40 pl-4">
                {noticia.descripcion}
              </p>
            )}

            {noticia.contenido ? (
              <div
                className="prose prose-sm md:prose-base max-w-none font-sans text-text/80 leading-relaxed
                  prose-headings:font-bold prose-headings:text-primary prose-headings:font-sans
                  prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-primary
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-blockquote:border-accent prose-blockquote:text-text/60
                  prose-img:rounded-sm prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: noticia.contenido }}
              />
            ) : (
              <p className="font-sans text-sm text-text/40">Esta noticia no tiene contenido aún.</p>
            )}
          </motion.div>
        </div>
      </article>

      <section className="relative overflow-hidden bg-primary py-14 md:py-20">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/images/img6.jpg)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
              ¿Necesita asesoría legal?
            </h2>
            <p className="font-sans text-[10px] sm:text-xs md:text-sm text-white/60 max-w-lg mx-auto leading-relaxed mb-6">
              Contáctenos hoy y agende una consulta con nuestros especialistas.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-accent text-primary px-5 md:px-7 py-2.5 md:py-3.5 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white active:scale-95 shadow-lg"
            >
              Solicitar consulta
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
