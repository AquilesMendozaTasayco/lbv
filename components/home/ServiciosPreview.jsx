import Link from "next/link";
import { ArrowRight, Building, Users, Briefcase, Shield } from "lucide-react";

const areas = [
  {
    icon: Building,
    title: "Administrativo",
    desc: "Formalización minera, ambiental, saneamiento físico legal, trámites ante Indecopi.",
  },
  {
    icon: Users,
    title: "Civil",
    desc: "Familiar, registral, obligaciones, contratos, nulidades y procesos civiles en general.",
  },
  {
    icon: Briefcase,
    title: "Laboral",
    desc: "Asesoría laboral, contratación, seguridad social y defensa en procesos laborales.",
  },
  {
    icon: Shield,
    title: "Penal",
    desc: "Defensa penal estratégica, litigios y asesoría en derecho penal corporativo.",
  },
];

export default function ServiciosPreview() {
  return (
    <section className="bg-bg-alt py-12 md:py-16 xl:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 md:mb-12 text-center">
          <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
            Nuestros Servicios
          </span>
          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 leading-tight">
            Áreas de práctica
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {areas.map((area, i) => {
            const Icon = area.icon;
            return (
              <div
                key={i}
                className="group rounded-sm border border-primary/10 bg-white p-5 md:p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                </div>

                <h3 className="font-sans text-sm md:text-base font-bold text-primary mb-1.5 md:mb-2">
                  {area.title}
                </h3>

                <p className="font-sans text-[10px] md:text-xs text-text/70 leading-relaxed">
                  {area.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 border-2 border-primary bg-primary text-white px-5 md:px-6 py-2.5 md:py-3 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-primary active:scale-95"
          >
            Ver todos los servicios
            <ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
