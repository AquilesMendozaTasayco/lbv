"use client";

import { useState, useEffect } from "react";
import { Shield, Target, Heart, Eye, BookOpen, Rocket, Compass, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide(s => (s + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <PageHero
        title="Nosotros"
        subtitle="Conozca más sobre LBV Abogados, nuestra historia, misión y visión de nuestra institución y los valores que nos guían."
        bgImage="/images/img7.jpg"
      />

      <section id="historia" className="bg-white py-12 md:py-16 xl:py-20">
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

      <section id="filosofia" className="relative overflow-hidden bg-primary py-8 md:py-10">
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

      <section id="valores" className="bg-bg-alt py-12 md:py-16 xl:py-20">
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

    </>
  );
}
