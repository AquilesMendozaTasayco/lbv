import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactCta() {
  return (
    <section className="relative w-full overflow-hidden bg-primary">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(/images/img8.jpg)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-14 xl:py-16">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row md:gap-8">
          <div className="text-center md:text-left">
            <h2 className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2">
              ¿Listo para defender sus derechos?
            </h2>
            <p className="font-sans text-[10px] sm:text-xs md:text-sm text-white/60 max-w-lg">
              Contáctenos hoy y recibirá asesoría legal personalizada de
              nuestro equipo de expertos.
            </p>
          </div>

          <Link
            href="/contacto"
            className="inline-flex shrink-0 items-center gap-2 bg-accent text-primary px-5 md:px-7 py-2.5 md:py-3.5 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white active:scale-95 shadow-lg"
          >
            Contáctenos
            <ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
