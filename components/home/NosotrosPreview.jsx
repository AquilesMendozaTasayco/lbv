"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  "/images/img6.jpg",
  "/images/img7.jpg",
  "/images/img8.jpg",
];

export default function NosotrosPreview() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide(s => (s + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-white py-12 md:py-16 xl:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
              Quiénes Somos
            </span>

            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 mb-3 md:mb-4 leading-tight">
              Su aliado legal de confianza
            </h2>

            <p className="font-sans text-[10px] sm:text-xs md:text-sm text-text/70 leading-relaxed mb-4 md:mb-6">
              En LBV Abogados contamos con un equipo de profesionales con amplia
              experiencia en el sector público y privado. Dominamos la cosa
              pública y sus procedimientos para lograr la obtención de licencias,
              derechos y servicios públicos, así como la defensa legal en materia
              civil, laboral y penal.
            </p>

            <p className="font-sans text-[10px] sm:text-xs md:text-sm text-text/70 leading-relaxed mb-5 md:mb-7">
              Nuestro compromiso es brindar soluciones jurídicas eficientes,
              éticas y personalizadas, acompañando a nuestros clientes en cada
              etapa del proceso legal.
            </p>

            <Link
              href="/nosotros"
              className="inline-flex items-center gap-2 border-2 border-primary bg-primary text-white px-5 md:px-6 py-2.5 md:py-3 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-primary active:scale-95"
            >
              Conócenos
              <ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-bg-alt">
              {slides.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="LBV Abogados"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                  style={{ opacity: currentSlide === i ? 1 : 0 }}
                />
              ))}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
