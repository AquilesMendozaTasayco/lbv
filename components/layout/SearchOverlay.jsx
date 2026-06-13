"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Newspaper, Briefcase, Users, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function SearchOverlay({ open, onClose }) {
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState({ publicaciones: [], noticias: [], servicios: [], equipo: [] });
  const [allData, setAllData] = useState(null);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQueryText("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fetchAll = async () => {
      try {
        const [pubSnap, notSnap, servSnap, eqSnap] = await Promise.all([
          getDocs(query(collection(db, "publicaciones"), orderBy("createdAt", "desc"), limit(50))),
          getDocs(query(collection(db, "noticias"), orderBy("createdAt", "desc"), limit(50))),
          getDocs(query(collection(db, "servicios"), orderBy("orden", "asc"))),
          getDocs(query(collection(db, "equipo"), orderBy("orden", "asc"))),
        ]);
        setAllData({
          publicaciones: pubSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.activo !== false),
          noticias: notSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.activo !== false),
          servicios: servSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.activo !== false),
          equipo: eqSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.activo !== false),
        });
      } catch { /* */ }
    };
    fetchAll();
  }, [open]);

  useEffect(() => {
    if (!allData || !queryText.trim()) {
      setResults({ publicaciones: [], noticias: [], servicios: [], equipo: [] });
      return;
    }
    const q = queryText.toLowerCase();
    const filter = (arr, fields) =>
      arr.filter(item => fields.some(f => item[f]?.toLowerCase().includes(q)));
    setResults({
      publicaciones: filter(allData.publicaciones, ["titulo", "descripcion"]),
      noticias: filter(allData.noticias, ["titulo", "descripcion"]),
      servicios: filter(allData.servicios, ["titulo", "desc", "tag"]),
      equipo: filter(allData.equipo, ["nombre", "cargo", "descripcion"]),
    });
  }, [queryText, allData]);

  const handleSelect = useCallback((type, item) => {
    onClose();
    const slug = slugify(item.titulo || item.nombre);
    const paths = { publicaciones: `/publicaciones/${slug}`, noticias: `/noticias/${slug}`, servicios: `/servicios/${slug}`, equipo: `/equipo/${slug}` };
    router.push(paths[type]);
  }, [onClose, router]);

  const handleViewAll = () => {
    if (!queryText.trim()) return;
    onClose();
    router.push(`/buscar?q=${encodeURIComponent(queryText.trim())}`);
  };

  const totalResults = results.publicaciones.length + results.noticias.length + results.servicios.length + results.equipo.length;
  const hasQuery = queryText.trim().length > 0;

  const sections = [
    { key: "publicaciones", icon: FileText, label: "Publicaciones", color: "text-accent" },
    { key: "noticias", icon: Newspaper, label: "Noticias", color: "text-blue-400" },
    { key: "servicios", icon: Briefcase, label: "Servicios", color: "text-emerald-400" },
    { key: "equipo", icon: Users, label: "Equipo", color: "text-amber-400" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[15vh]"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl mx-4 bg-white rounded-sm shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-primary/10 px-4 py-3">
              <Search size={16} className="text-text/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar publicaciones, noticias, servicios, abogados..."
                value={queryText}
                onChange={e => setQueryText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleViewAll(); if (e.key === "Escape") onClose(); }}
                className="flex-1 bg-transparent font-sans text-sm text-primary outline-none placeholder:text-text/30"
              />
              {queryText && (
                <button onClick={() => setQueryText("")} className="text-text/30 hover:text-text/60 transition-colors">
                  <X size={14} />
                </button>
              )}
              <button onClick={onClose} className="text-text/30 hover:text-text/60 transition-colors p-1">
                <X size={16} />
              </button>
            </div>

            {hasQuery && totalResults === 0 && (
              <div className="p-8 text-center">
                <Search size={36} className="mx-auto mb-3 text-text/20" />
                <p className="font-sans text-sm text-text/40">No se encontraron resultados para &quot;{queryText}&quot;</p>
              </div>
            )}

            {hasQuery && totalResults > 0 && (
              <div className="max-h-[55vh] overflow-y-auto p-2">
                <div className="space-y-1">
                  {sections.map(({ key, icon: Icon, label, color }) => {
                    const items = results[key];
                    if (!items.length) return null;
                    return (
                      <div key={key}>
                        <div className="flex items-center gap-2 px-3 py-2">
                          <Icon size={12} className={color} />
                          <span className="font-sans text-[9px] uppercase tracking-[0.15em] font-semibold text-text/50">{label}</span>
                          <span className="font-sans text-[9px] text-text/30">({items.length})</span>
                        </div>
                        {items.slice(0, 4).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelect(key, item)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-bg-alt transition-colors text-left group"
                          >
                            <Icon size={14} className={`${color} shrink-0`} />
                            <div className="min-w-0 flex-1">
                              <p className="font-sans text-xs font-medium text-primary truncate">{item.titulo || item.nombre}</p>
                              <p className="font-sans text-[9px] text-text/40 truncate">{item.descripcion || item.cargo || item.desc || item.tag}</p>
                            </div>
                            <ArrowRight size={12} className="text-text/20 group-hover:text-accent transition-colors shrink-0" />
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={handleViewAll}
                  className="w-full mt-2 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-accent hover:bg-accent/5 transition-colors rounded-sm"
                >
                  Ver todos los resultados ({totalResults})
                </button>
              </div>
            )}

            {!hasQuery && (
              <div className="p-8 text-center">
                <Search size={32} className="mx-auto mb-2 text-text/20" />
                <p className="font-sans text-xs text-text/40">Escribe para buscar en publicaciones, noticias, servicios y equipo</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
