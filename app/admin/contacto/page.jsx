"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Swal from "sweetalert2";
import { Save, MapPin, Phone, Mail, Clock, MessageSquare, Map, Globe } from "lucide-react";

const DOC_ID = "contacto";

const defaults = {
  direccion: "Av. Principal 1234, San Isidro",
  ciudad: "Lima, Perú",
  telefono: "+51 989 592 806",
  email: "contacto@lbvabogados.pe",
  horario: "Lun – Vie: 9:00 am – 6:00 pm\nSáb: 9:00 am – 1:00 pm",
  respuestaRapida: "Nuestro equipo responderá su consulta en un máximo de 24 horas hábiles.",
  mapaSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.7703786338444!2d-77.036525!3d-12.098142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8f3f7f5c1f7%3A0x3f3f3f3f3f3f3f3f!2sSan+Isidro%2C+Lima%2C+Peru!5e0!3m2!1sen!2s!4v1",
  tiktok: "https://www.tiktok.com/@lbv.abogados",
  linkedin: "https://www.linkedin.com/company/lbv-abogados/",
  instagram: "https://www.instagram.com/lbv_abogados",
  facebook: "https://www.facebook.com/share/1HDWhUbyWn/",
};

export default function AdminContactoPage() {
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "config", DOC_ID));
        if (snap.exists()) {
          const d = snap.data();
          setForm({
            direccion: d.direccion || "",
            ciudad: d.ciudad || "",
            telefono: d.telefono || "",
            email: d.email || "",
            horario: d.horario || "",
            respuestaRapida: d.respuestaRapida || "",
            mapaSrc: d.mapaSrc || "",
            tiktok: d.tiktok || "",
            linkedin: d.linkedin || "",
            instagram: d.instagram || "",
            facebook: d.facebook || "",
          });
        }
      } catch { /* defaults */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "config", DOC_ID), {
        ...form,
        updatedAt: serverTimestamp(),
      });
      Swal.fire({ icon: "success", title: "Datos guardados", timer: 1200, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error al guardar", text: e.message });
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-sm border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-1 bg-accent" />
              <h1 className="font-sans text-3xl font-bold text-primary">Contacto</h1>
            </div>
            <p className="mt-1 ml-4 font-sans text-xs text-text/50 uppercase tracking-wider">
              Información de contacto del estudio
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-primary shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Save size={16} /> {saving ? "Guardando..." : "Guardar"}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Columna izquierda */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-sm border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-primary/10 pb-3 mb-5">
              <MapPin size={15} className="text-accent" />
              <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Dirección</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Dirección</label>
                <input type="text" value={form.direccion}
                  onChange={e => setForm(p => ({ ...p, direccion: e.target.value }))}
                  className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30" />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Ciudad / País</label>
                <input type="text" value={form.ciudad}
                  onChange={e => setForm(p => ({ ...p, ciudad: e.target.value }))}
                  className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-sm border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-primary/10 pb-3 mb-5">
              <Phone size={15} className="text-accent" />
              <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Teléfono</h3>
            </div>
            <input type="text" value={form.telefono}
              onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
              className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-sm border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-primary/10 pb-3 mb-5">
              <Mail size={15} className="text-accent" />
              <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Correo electrónico</h3>
            </div>
            <input type="email" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30" />
          </motion.div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-sm border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-primary/10 pb-3 mb-5">
              <Clock size={15} className="text-accent" />
              <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Horario</h3>
            </div>
            <textarea rows={3} value={form.horario}
              onChange={e => setForm(p => ({ ...p, horario: e.target.value }))}
              className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none" />
            <p className="mt-1 font-sans text-[9px] text-text/40">Usa saltos de línea para separar días y horarios.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-sm border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-primary/10 pb-3 mb-5">
              <MessageSquare size={15} className="text-accent" />
              <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Texto de respuesta rápida</h3>
            </div>
            <textarea rows={2} value={form.respuestaRapida}
              onChange={e => setForm(p => ({ ...p, respuestaRapida: e.target.value }))}
              className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-sm border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-primary/10 pb-3 mb-5">
              <Map size={15} className="text-accent" />
              <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Mapa (Google Maps iframe)</h3>
            </div>
            <textarea rows={3} value={form.mapaSrc}
              onChange={e => setForm(p => ({ ...p, mapaSrc: e.target.value }))}
              className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none font-mono text-[11px]" />
            <p className="mt-1 font-sans text-[9px] text-text/40">Pega el src del iframe de Google Maps.</p>
            {form.mapaSrc && (
              <div className="mt-3 h-32 overflow-hidden rounded-sm border border-primary/10">
                <iframe src={form.mapaSrc} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Preview mapa" />
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-sm border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-primary/10 pb-3 mb-5">
              <Globe size={15} className="text-accent" />
              <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Redes Sociales</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">TikTok</label>
                <input type="url" value={form.tiktok}
                  onChange={e => setForm(p => ({ ...p, tiktok: e.target.value }))}
                  className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30" />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">LinkedIn</label>
                <input type="url" value={form.linkedin}
                  onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))}
                  className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30" />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Instagram</label>
                <input type="url" value={form.instagram}
                  onChange={e => setForm(p => ({ ...p, instagram: e.target.value }))}
                  className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30" />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Facebook</label>
                <input type="url" value={form.facebook}
                  onChange={e => setForm(p => ({ ...p, facebook: e.target.value }))}
                  className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
