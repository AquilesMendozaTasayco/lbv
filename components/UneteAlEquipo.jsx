"use client";

import { useState, useEffect } from "react";
import { UserPlus, X, Upload, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Swal from "sweetalert2";

export default function UneteAlEquipo({ id }) {
  const [showModal, setShowModal] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nombre: "", apellidos: "", email: "", telefono: "", areaInteres: "", mensaje: "",
  });
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchEsps = async () => {
      try {
        const q = query(collection(db, "servicios"), orderBy("orden", "asc"));
        const snap = await getDocs(q);
        setEspecialidades(snap.docs.map(d => ({ id: d.id, titulo: d.data().titulo })));
      } catch { /* */ }
    };
    fetchEsps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellidos || !form.email) {
      Swal.fire({ icon: "warning", title: "Campos requeridos", text: "Nombre, apellidos y email son obligatorios." });
      return;
    }
    setSubmitting(true);
    try {
      let cvUrl = "";
      if (cvFile) {
        const r = ref(storage, `postulaciones/${Date.now()}_${cvFile.name}`);
        await uploadBytes(r, cvFile);
        cvUrl = await getDownloadURL(r);
      }
      await addDoc(collection(db, "postulaciones"), {
        ...form, cv: cvUrl, createdAt: serverTimestamp(),
      });
      Swal.fire({ icon: "success", title: "Postulación enviada", text: "Nos pondremos en contacto con usted.", timer: 2000, showConfirmButton: false });
      setShowModal(false);
      setForm({ nombre: "", apellidos: "", email: "", telefono: "", areaInteres: "", mensaje: "" });
      setCvFile(null);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo enviar su postulación." });
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <section id={id} className="relative overflow-hidden bg-primary py-16 md:py-24">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/90" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
              <UserPlus className="h-7 w-7 text-accent" />
            </div>
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              Únete a nuestro equipo
            </h2>
            <p className="font-sans text-[10px] sm:text-xs md:text-sm text-white/60 max-w-lg mx-auto leading-relaxed mb-8">
              Si compartes nuestra pasión por el derecho y quieres formar parte de un equipo en crecimiento, déjanos tu postulación.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-accent text-primary px-6 md:px-8 py-3 md:py-3.5 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white active:scale-95 shadow-lg"
            >
              <UserPlus size={16} /> Quiero postular
            </motion.button>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 max-h-[94vh] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sm bg-white shadow-2xl border border-primary/10"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-white px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-accent" />
                  <h2 className="font-sans text-lg font-bold text-primary">Postular a LBV Abogados</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-sm p-2 text-text/40 hover:bg-bg-alt transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Nombre *</label>
                    <input type="text" value={form.nombre} required
                      onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                      placeholder="Juan"
                      className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Apellidos *</label>
                    <input type="text" value={form.apellidos} required
                      onChange={e => setForm(p => ({ ...p, apellidos: e.target.value }))}
                      placeholder="Pérez"
                      className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Email *</label>
                    <input type="email" value={form.email} required
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="juan@ejemplo.com"
                      className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Teléfono</label>
                    <input type="tel" value={form.telefono}
                      onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
                      placeholder="999 888 777"
                      className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Área de interés</label>
                  <select value={form.areaInteres}
                    onChange={e => setForm(p => ({ ...p, areaInteres: e.target.value }))}
                    className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30"
                  >
                    <option value="">Seleccione una opción</option>
                    {especialidades.map(esp => (
                      <option key={esp.id} value={esp.id}>{esp.titulo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Adjuntar CV</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e => setCvFile(e.target.files[0])}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload"
                      className="flex cursor-pointer items-center gap-3 rounded-sm border border-primary/10 bg-bg-alt px-4 py-3 transition-all hover:border-accent"
                    >
                      <Upload size={16} className="text-accent" />
                      <span className="font-sans text-xs text-text/60">
                        {cvFile ? cvFile.name : "Seleccionar archivo (PDF, DOC)"}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Mensaje</label>
                  <textarea value={form.mensaje}
                    onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                    placeholder="Cuéntanos por qué te gustaría unirte al equipo..."
                    rows={4}
                    className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30 resize-none" />
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 rounded-sm border border-primary/10 bg-white px-6 py-3 font-sans text-sm font-semibold text-text/70 hover:bg-bg-alt transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3 font-sans text-sm font-bold text-primary shadow-lg hover:opacity-90 disabled:opacity-50 transition-all">
                    <Send size={14} /> {submitting ? "Enviando..." : "Enviar postulación"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}