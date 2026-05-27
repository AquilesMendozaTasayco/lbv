"use client";

import { motion } from "framer-motion";
import { Scale, ArrowRight } from "lucide-react";
import Link from "next/link";

const modules = [
  { label: "Banners", href: "/admin/banners", desc: "Administrar carrusel del hero" },
  { label: "Contacto", href: "/admin/contacto", desc: "Editar información de contacto" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
            <Scale className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="font-sans text-2xl md:text-3xl font-bold text-primary">
              Bienvenido
            </h1>
            <p className="font-sans text-xs text-text/50 mt-0.5">
              Panel de Administración de LBV Abogados
            </p>
          </div>
        </div>

        <p className="font-sans text-sm text-text/60 max-w-xl leading-relaxed">
          Desde aquí puede gestionar el contenido del sitio web. Seleccione un módulo para comenzar.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
        {modules.map((m, i) => (
          <motion.div
            key={m.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
          >
            <Link
              href={m.href}
              className="group block rounded-sm border border-primary/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Scale className="h-5 w-5 text-accent" />
                </div>
                <ArrowRight size={16} className="text-text/20 group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-sans text-sm font-bold text-primary mb-1">{m.label}</h3>
              <p className="font-sans text-[10px] text-text/50">{m.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
