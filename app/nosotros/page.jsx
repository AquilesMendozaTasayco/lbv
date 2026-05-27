"use client";

import { Shield, Target, Heart, Eye, BookOpen, Rocket, Compass, Gem } from "lucide-react";
import { motion } from "framer-motion";
import PageHero from "@/components/ui/PageHero";

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
  return (
    <>
      <PageHero
        title="Nosotros"
        subtitle="Conozca más sobre LBV Abogados, nuestra historia y nuestro equipo"
        bgImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80"
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
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800&q=80)",
                }}
              />
              <div className="absolute inset-0 border border-primary/10 rounded-sm pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-14 md:py-20">
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
            className="mb-8 md:mb-12 text-center"
          >
            <div className="mx-auto flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-accent/20">
              <Target className="h-6 w-6 md:h-7 md:w-7 text-accent" />
            </div>
            <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
              Nuestra Filosofía
            </span>
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-2 leading-tight">
              Misión y Visión
            </h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-md p-6 md:p-8 text-center md:text-left transition-all duration-300 hover:bg-white/15 hover:border-accent/30"
            >
              <div className="mx-auto md:mx-0 mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-accent/20">
                <Rocket className="h-5 w-5 md:h-6 md:w-6 text-accent" />
              </div>
              <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                Nuestra Misión
              </span>
              <h3 className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mt-2 mb-3 md:mb-4 leading-tight">
                Misión
              </h3>
              <p className="font-sans text-[10px] sm:text-xs md:text-sm text-white/70 leading-relaxed">
                Brindar asesoría legal integral de excelencia, con un enfoque
                ético y estratégico, defendiendo los intereses de nuestros
                clientes con compromiso, responsabilidad y resultados
                concretos en cada área del derecho.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-md p-6 md:p-8 text-center md:text-left transition-all duration-300 hover:bg-white/15 hover:border-accent/30"
            >
              <div className="mx-auto md:mx-0 mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-accent/20">
                <Compass className="h-5 w-5 md:h-6 md:w-6 text-accent" />
              </div>
              <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                Nuestra Visión
              </span>
              <h3 className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mt-2 mb-3 md:mb-4 leading-tight">
                Visión
              </h3>
              <p className="font-sans text-[10px] sm:text-xs md:text-sm text-white/70 leading-relaxed">
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

          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {valores.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.1 }}
                  className="rounded-sm border border-primary/10 bg-white p-5 md:p-6 text-center transition-all duration-300 hover:border-accent/30 hover:shadow-md"
                >
                  <div className="mx-auto mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-accent/10">
                    <Icon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <h3 className="font-sans text-sm md:text-base font-bold text-primary mb-1.5 md:mb-2">
                    {v.title}
                  </h3>
                  <p className="font-sans text-[10px] md:text-xs text-text/70 leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
