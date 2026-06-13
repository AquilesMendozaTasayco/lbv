"use client";

import { useState, useEffect } from "react";
import { Shield, Target, Heart, Eye, BookOpen, Rocket, Compass, Gem, UserPlus, X, Upload, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Swal from "sweetalert2";
import PageHero from "@/components/ui/PageHero";

const slides = [
  "/images/img6.jpg",
  "/images/img7.jpg",
  "/images/img8.jpg",
];

const valores = [
  {
    icon: Shield,
    title: "Ética",
    desc: "Actuamos con integridad y responsabilidad en cada caso, manteniendo la confidencialidad y el respeto por nuestros clientes.",
  },
  {
    icon: Target,
    title: "Excelencia",
    desc: "Buscamos la mejor estrategia legal para cada situación, con un equipo en constante actualización y especialización.",
  },
  {
    icon: Heart,
    title: "Compromiso",
    desc: "Nos involucramos de manera genuina en cada caso, acompañando a nuestros clientes con dedicación y cercanía.",
  },
  {
    icon: Eye,
    title: "Transparencia",
    desc: "Comunicación clara y honesta en cada etapa del proceso. Nuestros clientes siempre saben qué esperar.",
  },
];

export default function NosotrosPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    areaInteres: "",
    mensaje: "",
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

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide(s => (s + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
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
        ...form,
        cv: cvUrl,
        createdAt: serverTimestamp(),
      });

      Swal.fire({ icon: "success", title: "Postulación enviada", text: "Nos pondremos en contacto con usted.", timer: 2000, showConfirmButton: false });
      setShowModal(false);
      setForm({ nombre: "", apellidos: "", email: "", telefono: "", areaInteres: "", mensaje: "" });
      setCvFile(null);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo enviar su postulación." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        title="Nosotros"
        subtitle="Conozca más sobre LBV Abogados, nuestra historia y nuestro equipo"
        bgImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <section className="bg-white py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold inline-flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 md:h-3.5 md:w-3.5" />
                Nuestra Historia
              </span>
              <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 mb-3 md:mb-4 leading-tight">
                Trayectoria y compromiso legal
              </h2>
              <p className="font-sans text-[10px] sm:text-xs md:text-sm text-text/70 leading-relaxed mb-3 md:mb-4">
                LBV Abogados nace de la visión de ofrecer un servicio legal de
                excelencia, combinando la experiencia en el sector público con
                una visión estratégica del derecho privado.
              </p>
              <p className="font-sans text-[10px] sm:text-xs md:text-sm text-text/70 leading-relaxed">
                Con más de 15 años de experiencia, nuestro equipo ha participado
                en casos emblemáticos en las áreas administrativa, civil,
                laboral y penal, consolidándonos como un estudio de referencia
                en el mercado legal peruano.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-sm"
            >
              <div className="absolute inset-0">
                {slides.map((src, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                    style={{
                      backgroundImage: `url(${src})`,
                      opacity: currentSlide === i ? 1 : 0,
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 border border-primary/10 rounded-sm pointer-events-none" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? "w-6 bg-accent" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-8 md:py-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/85 to-primary/80" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 md:mb-8 text-center"
          >
            <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
              Nuestra Filosofía
            </span>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-md p-4 md:p-5 text-center md:text-left transition-all duration-300 hover:bg-white/15 hover:border-accent/30"
            >
              <div className="mx-auto md:mx-0 mb-2 md:mb-3 flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-accent/20">
                <Rocket className="h-4 w-4 md:h-[18px] md:w-[18px] text-accent" />
              </div>
              <h3 className="font-sans text-sm md:text-base font-bold text-white mb-1.5 md:mb-2">
                Misión
              </h3>
              <p className="font-sans text-[10px] md:text-xs text-white/70 leading-relaxed">
                Brindar asesoría legal integral de excelencia, con un enfoque
                ético y estratégico, defendiendo los intereses de nuestros
                clientes con compromiso, responsabilidad y resultados
                concretos en cada área del derecho.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
              className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-md p-4 md:p-5 text-center md:text-left transition-all duration-300 hover:bg-white/15 hover:border-accent/30"
            >
              <div className="mx-auto md:mx-0 mb-2 md:mb-3 flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-accent/20">
                <Compass className="h-4 w-4 md:h-[18px] md:w-[18px] text-accent" />
              </div>
              <h3 className="font-sans text-sm md:text-base font-bold text-white mb-1.5 md:mb-2">
                Visión
              </h3>
              <p className="font-sans text-[10px] md:text-xs text-white/70 leading-relaxed">
                Ser el estudio de abogados líder en el Perú, reconocido por
                nuestra excelencia profesional, innovación legal y el impacto
                positivo en la vida de nuestros clientes y la sociedad.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-bg-alt py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 md:mb-12 text-center"
          >
            <div className="mx-auto flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-accent/10">
              <Gem className="h-6 w-6 md:h-7 md:w-7 text-accent" />
            </div>
            <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
              Nuestros Valores
            </span>
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 leading-tight">
              Lo que nos define
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
            {valores.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="flex flex-col items-center gap-2 rounded-sm border border-primary/10 bg-white p-4 md:p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-sans text-xs md:text-sm font-bold text-primary text-center">
                    {v.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-16 md:py-24">
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
