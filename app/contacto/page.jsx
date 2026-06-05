"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PageHero from "@/components/ui/PageHero";

export default function ContactoPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "config", "contacto"));
        if (snap.exists()) setData(snap.data());
      } catch { /* fallback a hardcoded */ }
    };
    fetch();
  }, []);

  const d = data || {};

  const horarioLines = d.horario ? d.horario.split("\n") : [];

  return (
    <>
      <PageHero
        title="Contacto"
        subtitle="Estamos listos para atenderlo. Contáctenos y recibirá asesoría legal personalizada"
        bgImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <section className="bg-white py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-3"
            >
              <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold inline-flex items-center gap-1.5">
                <Send className="h-3 w-3 md:h-3.5 md:w-3.5" />
                Escríbanos
              </span>
              <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 mb-6 md:mb-8 leading-tight">
                Envíenos su consulta
              </h2>

              <form className="space-y-4 md:space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="font-sans text-[10px] md:text-xs font-semibold text-text/80 mb-1 block">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-sm border border-primary/15 bg-bg-alt px-4 py-2.5 md:py-3 font-sans text-[10px] md:text-sm text-text outline-none transition-all duration-200 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/30"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] md:text-xs font-semibold text-text/80 mb-1 block">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full rounded-sm border border-primary/15 bg-bg-alt px-4 py-2.5 md:py-3 font-sans text-[10px] md:text-sm text-text outline-none transition-all duration-200 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/30"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="font-sans text-[10px] md:text-xs font-semibold text-text/80 mb-1 block">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-sm border border-primary/15 bg-bg-alt px-4 py-2.5 md:py-3 font-sans text-[10px] md:text-sm text-text outline-none transition-all duration-200 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/30"
                      placeholder="963 447 503"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] md:text-xs font-semibold text-text/80 mb-1 block">
                      Área de interés
                    </label>
                    <select className="w-full rounded-sm border border-primary/15 bg-bg-alt px-4 py-2.5 md:py-3 font-sans text-[10px] md:text-sm text-text outline-none transition-all duration-200 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/30">
                      <option value="">Seleccione una opción</option>
                      <option value="administrativo">Administrativo</option>
                      <option value="civil">Civil</option>
                      <option value="laboral">Laboral</option>
                      <option value="penal">Penal</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-sans text-[10px] md:text-xs font-semibold text-text/80 mb-1 block">
                    Mensaje *
                  </label>
                  <textarea
                    rows={5}
                    required
                    className="w-full resize-y rounded-sm border border-primary/15 bg-bg-alt px-4 py-2.5 md:py-3 font-sans text-[10px] md:text-sm text-text outline-none transition-all duration-200 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/30"
                    placeholder="Describa su caso o consulta..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-accent text-primary px-6 md:px-8 py-3 md:py-3.5 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 shadow-md"
                >
                  Enviar mensaje
                  <Send size={12} className="md:h-3.5 md:w-3.5" />
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="lg:col-span-2"
            >
              <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5" />
                Información
              </span>
              <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 mb-6 md:mb-8 leading-tight">
                Datos de contacto
              </h2>

              <div className="space-y-5 md:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs md:text-sm font-bold text-primary">Dirección</h4>
                    <p className="font-sans text-[10px] md:text-sm text-text/70 leading-relaxed mt-0.5">
                      {d.direccion || "Av. Principal 1234, San Isidro"}
                      <br />
                      {d.ciudad || "Lima, Perú"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs md:text-sm font-bold text-primary">Teléfono</h4>
                    <p className="font-sans text-[10px] md:text-sm text-text/70 leading-relaxed mt-0.5">
                      {d.telefono || "+51 963 447 503"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs md:text-sm font-bold text-primary">Correo</h4>
                    <p className="font-sans text-[10px] md:text-sm text-text/70 leading-relaxed mt-0.5">
                      {d.email || "contacto@lbvabogados.pe"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs md:text-sm font-bold text-primary">Horario</h4>
                    <p className="font-sans text-[10px] md:text-sm text-text/70 leading-relaxed mt-0.5">
                      {horarioLines.length > 0
                        ? horarioLines.map((line, i) => <span key={i}>{line}{i < horarioLines.length - 1 && <br />}</span>)
                        : <>Lun – Vie: 9:00 am – 6:00 pm<br />Sáb: 9:00 am – 1:00 pm</>}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-sm border border-primary/10 bg-bg-alt p-5 md:p-6">
                <p className="font-sans text-[10px] md:text-xs text-text/70 leading-relaxed">
                  <strong className="text-primary">Respuesta rápida:</strong>{" "}
                  {d.respuestaRapida || "Nuestro equipo responderá su consulta en un máximo de 24 horas hábiles."}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {d.mapaSrc && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full"
        >
          <div className="h-[300px] md:h-[400px] w-full">
            <iframe
              src={d.mapaSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de LBV Abogados"
            />
          </div>
        </motion.section>
      )}
    </>
  );
}
