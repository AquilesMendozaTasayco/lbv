import Link from "next/link";
import { Calendar, Award, ShieldCheck, Users } from "lucide-react";

const items = [
  {
    icon: Calendar,
    value: "+15 Años",
    desc: "De experiencia en el ejercicio del derecho",
  },
  {
    icon: Award,
    value: "+500 Casos",
    desc: "Resueltos con éxito para nuestros clientes",
  },
  {
    icon: ShieldCheck,
    value: "Confidencialidad",
    desc: "Absoluta reserva y ética profesional",
  },
  {
    icon: Users,
    value: "Atención Personalizada",
    desc: "Estrategia legal a la medida de cada caso",
  },
];

export default function PorQueElegirnos() {
  return (
    <section className="relative bg-primary py-12 md:py-16 xl:py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.04]"
        style={{
          backgroundImage:
            "url(/images/img6.jpg)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 md:mb-12 text-center">
          <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
            Por qué elegirnos
          </span>
          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-2 leading-tight">
            Razones para confiar en LBV
          </h2>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={i}
                href="/nosotros"
                className="group block rounded-sm border border-white/10 bg-white/5 p-6 md:p-7 text-center transition-all duration-300 hover:border-accent/30 hover:bg-white/10"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <Icon className="h-6 w-6 md:h-7 md:w-7 text-accent" />
                </div>

                <h3 className="font-sans text-lg md:text-xl font-bold text-white mb-1">
                  {item.value}
                </h3>

                <p className="font-sans text-[10px] md:text-xs text-white/50 leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
