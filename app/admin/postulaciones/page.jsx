"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FileText, Mail, Phone, MapPin, Download,
  Briefcase, MessageSquare, User,
} from "lucide-react";

export default function AdminPostulacionesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(query(collection(db, "postulaciones"), orderBy("createdAt", "desc")));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch { /* */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-1 bg-accent" />
          <h1 className="font-sans text-3xl font-bold text-primary">Postulaciones</h1>
        </div>
        <p className="mt-1 ml-4 font-sans text-xs text-text/50 uppercase tracking-wider">
          CVs recibidos de candidatos
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-sm border-4 border-accent border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-sm bg-white p-16 text-center border border-primary/10 shadow-sm">
          <FileText size={56} className="mx-auto mb-4 text-text/20" />
          <p className="font-sans text-sm font-bold uppercase tracking-widest text-text/50">Sin postulaciones</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="rounded-sm border border-primary/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <User size={18} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-bold text-primary">{item.nombre} {item.apellidos}</h3>
                    <p className="font-sans text-[10px] text-text/40">{item.createdAt?.toDate?.().toLocaleDateString("es-PE") || ""}</p>
                  </div>
                </div>
                {item.cv && (
                  <a href={item.cv} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-sm bg-accent/5 px-3 py-2 font-sans text-[9px] font-semibold uppercase text-accent hover:bg-accent/10 transition-colors">
                    <Download size={12} /> CV
                  </a>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {item.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} className="text-text/30" />
                    <span className="font-sans text-xs text-text/60">{item.email}</span>
                  </div>
                )}
                {item.telefono && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="text-text/30" />
                    <span className="font-sans text-xs text-text/60">{item.telefono}</span>
                  </div>
                )}
                {item.areaInteres && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={12} className="text-text/30" />
                    <span className="font-sans text-xs text-text/60">{item.areaInteres}</span>
                  </div>
                )}
              </div>
              {item.mensaje && (
                <div className="mt-3 flex items-start gap-1.5">
                  <MessageSquare size={12} className="text-text/30 mt-0.5" />
                  <p className="font-sans text-xs text-text/50 leading-relaxed">{item.mensaje}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
