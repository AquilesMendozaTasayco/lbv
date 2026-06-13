"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building, Users, Briefcase, Shield, Scale,
  Gavel, FileText, Landmark, ArrowLeft, Check,
  Calendar, ChevronRight,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";

const ICONS = {
  Building, Users, Briefcase, Shield, Scale,
  Gavel, FileText, Landmark,
};

const STATIC_SERVICIOS = [
  {
    slug: "administrativo",
    icon: "Building",
    title: "Administrativo",
    tag: "Derecho Público",
    desc: "Asesoramos a empresas y particulares en procedimientos ante entidades públicas, con un enfoque estratégico y de cumplimiento normativo.",
    descExtensa: "Nuestro equipo de derecho administrativo cuenta con amplia experiencia en la tramitación de procedimientos ante organismos reguladores y entidades del Estado. Brindamos asesoría integral en todas las etapas del procedimiento administrativo, desde la planificación estratégica hasta la defensa en sedes administrativas y judiciales. Hemos participado exitosamente en casos de alta complejidad, incluyendo la obtención de concesiones, licencias y autorizaciones sectoriales, así como en la defensa de nuestros clientes en procedimientos sancionadores y de fiscalización.",
    color: "from-blue-900/80 to-blue-800/40",
    bg: "/images/img2.jpg",
    items: [
      "Formalización minera y concesiones",
      "Derecho ambiental y evaluación de impacto",
      "Saneamiento físico legal de predios",
      "Procedimientos ante Indecopi",
      "Contratos y concesiones públicas",
    ],
    equipo: [
      { nombre: "Dr. Carlos López", cargo: "Socio - Derecho Administrativo", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
      { nombre: "Dra. María García", cargo: "Asociada Senior", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
      { nombre: "Dr. Juan Martínez", cargo: "Asociado", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
    ],
    publicaciones: [
      { titulo: "Nueva regulación ambiental: impacto en el sector minero", fecha: "15 May 2026", tipo: "Artículo" },
      { titulo: "Procedimientos administrativos electrónicos: guía práctica", fecha: "02 Abr 2026", tipo: "Guía" },
    ],
    noticias: [
      { titulo: "LBV Abogados asesora en la obtención de concesión minera", fecha: "10 Jun 2026" },
      { titulo: "Nuestro equipo participa en seminario de derecho administrativo", fecha: "22 May 2026" },
    ],
  },
  {
    slug: "civil",
    icon: "Users",
    title: "Civil",
    tag: "Derecho Privado",
    desc: "Brindamos asesoría integral en derecho civil y familiar, protegiendo los intereses patrimoniales y personales de nuestros clientes.",
    descExtensa: "El área de derecho civil de LBV Abogados ofrece una cobertura completa de todas las materias vinculadas al derecho privado. Nuestros especialistas cuentan con una sólida formación académica y una vasta experiencia en litigios civiles, asesoría preventiva y planificación patrimonial. Atendemos tanto a personas naturales como jurídicas, brindando soluciones legales eficientes y personalizadas para cada caso.",
    color: "from-emerald-900/80 to-emerald-800/40",
    bg: "/images/img3.jpg",
    items: [
      "Derecho de familia: divorcios, tenencia, alimentos",
      "Derecho registral y notarial",
      "Obligaciones y contratos civiles",
      "Nulidad de actos jurídicos",
      "Procesos civiles en general",
    ],
    equipo: [
      { nombre: "Dra. Ana Torres", cargo: "Socia - Derecho Civil", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
      { nombre: "Dr. Pedro Sánchez", cargo: "Asociado Senior", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
    ],
    publicaciones: [
      { titulo: "Nuevas tendencias en derecho de familia", fecha: "20 May 2026", tipo: "Artículo" },
      { titulo: "Guía de procesos civiles en el Perú", fecha: "05 Abr 2026", tipo: "Guía" },
    ],
    noticias: [
      { titulo: "LBV Abogados participa en congreso de derecho civil", fecha: "15 May 2026" },
    ],
  },
  {
    slug: "laboral",
    icon: "Briefcase",
    title: "Laboral",
    tag: "Derecho del Trabajo",
    desc: "Ofrecemos asesoría laboral preventiva y defensa en litigios, velando por el cumplimiento de los derechos de trabajadores y empleadores.",
    descExtensa: "Nuestra práctica laboral abarca todas las áreas del derecho del trabajo y la seguridad social. Brindamos asesoría preventiva a empresas para optimizar sus relaciones laborales y minimizar riesgos de litigios, así como defensa especializada en procesos judiciales laborales. Representamos tanto a empleadores como a trabajadores, con un enfoque ético y estratégico en cada caso.",
    color: "from-amber-900/80 to-amber-800/40",
    bg: "/images/img11.png",
    items: [
      "Asesoría en contratación laboral",
      "Seguridad social y pensiones",
      "Procesos laborales y despidos",
      "Negociación colectiva",
      "Cumplimiento normativo laboral",
    ],
    equipo: [
      { nombre: "Dr. Roberto Díaz", cargo: "Socio - Derecho Laboral", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
      { nombre: "Dra. Carmen Ruiz", cargo: "Asociada Senior", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
    ],
    publicaciones: [
      { titulo: "Reforma laboral: cambios en la contratación", fecha: "10 May 2026", tipo: "Artículo" },
    ],
    noticias: [
      { titulo: "LBV Abogados organiza taller de derecho laboral", fecha: "28 May 2026" },
      { titulo: "Nueva jurisprudencia en materia de despidos", fecha: "12 May 2026" },
    ],
  },
  {
    slug: "penal",
    icon: "Shield",
    title: "Penal",
    tag: "Derecho Penal",
    desc: "Defensa penal estratégica con un enfoque corporativo, protegiendo a personas y empresas en todas las etapas del proceso penal.",
    descExtensa: "El equipo de derecho penal de LBV Abogados combina una profunda experiencia en litigios penales con un enfoque corporativo moderno. Brindamos defensa estratégica en todas las etapas del proceso penal, desde la investigación preliminar hasta el juicio oral y las instancias de casación. Contamos con especialistas en derecho penal corporativo, compliance y delitos económicos, ofreciendo una defensa integral y de alta especialización.",
    color: "from-red-900/80 to-red-800/40",
    bg: "/images/img4.jpg",
    items: [
      "Defensa penal estratégica",
      "Derecho penal corporativo",
      "Litigios y juicios orales",
      "Asesoría en compliance penal",
      "Recursos y casaciones",
    ],
    equipo: [
      { nombre: "Dr. Fernando Vega", cargo: "Socio - Derecho Penal", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
      { nombre: "Dra. Lucía Mendoza", cargo: "Asociada Senior", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
      { nombre: "Dr. Andrés Paz", cargo: "Asociado", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
    ],
    publicaciones: [
      { titulo: "El compliance penal en las empresas peruanas", fecha: "18 May 2026", tipo: "Artículo" },
      { titulo: "Guía de defensa penal corporativa", fecha: "01 Abr 2026", tipo: "Guía" },
      { titulo: "Nuevos delitos económicos: análisis legal", fecha: "15 Mar 2026", tipo: "Artículo" },
    ],
    noticias: [
      { titulo: "LBV Abogados obtiene absolución en caso corporativo", fecha: "05 Jun 2026" },
      { titulo: "Participación en seminario de derecho penal económico", fecha: "20 May 2026" },
    ],
  },
];

const TABS = ["Descripción y Equipo", "Publicaciones y Noticias"];

export default function ServicioDetailPage() {
  const params = useParams();
  const [tab, setTab] = useState(0);

  const servicio = STATIC_SERVICIOS.find(s => s.slug === params.slug);
  const Icon = servicio ? ICONS[servicio.icon] || Building : Building;

  if (!servicio) {
    return (
      <>
        <PageHero
          title="Servicio no encontrado"
          subtitle="El área de práctica que busca no está disponible"
          bgImage="/images/img4.jpg"
        />
        <div className="py-20 text-center">
          <Building size={56} className="mx-auto mb-4 text-text/20" />
          <p className="font-sans text-sm text-text/40 mb-6">El servicio que buscas no existe o ha sido removido.</p>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-accent font-sans text-xs font-bold uppercase tracking-widest hover:underline"
          >
            <ArrowLeft size={14} /> Volver a Servicios
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        title={servicio.title}
        subtitle={servicio.tag}
        bgImage={servicio.bg}
      />

      <section className="py-8 md:py-10 border-b border-primary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-1.5 font-sans text-[10px] md:text-xs text-text/50 hover:text-accent transition-colors"
          >
            <ArrowLeft size={12} /> Volver a Servicios
          </Link>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="border-b border-primary/10 mb-8">
            <div className="flex gap-8 md:gap-10">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setTab(i)}
                  className={`pb-3 font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 border-b-2 ${
                    tab === i
                      ? "border-accent text-accent"
                      : "border-transparent text-text/40 hover:text-text/70"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* TAB: Descripción y Equipo */}
          {tab === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="max-w-4xl mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-accent/10">
                    <Icon className="h-7 w-7 md:h-8 md:w-8 text-accent" />
                  </div>
                  <div>
                    <h1 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                      {servicio.title}
                    </h1>
                    <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                      {servicio.tag}
                    </span>
                  </div>
                </div>

                <p className="font-sans text-xs md:text-sm text-text/70 leading-relaxed mb-8">
                  {servicio.descExtensa}
                </p>

                {servicio.items.length > 0 && (
                  <div className="rounded-sm border border-primary/10 bg-bg-alt p-6 md:p-8">
                    <h3 className="font-sans text-sm md:text-base font-bold text-primary mb-4">
                      Servicios incluidos
                    </h3>
                    <ul className="grid gap-3 md:grid-cols-2">
                      {servicio.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                            <Check className="h-3 w-3 text-accent" />
                          </div>
                          <span className="font-sans text-xs md:text-sm text-text/70 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <h3 className="font-sans text-lg md:text-xl font-bold text-primary mb-6">
                Equipo especializado
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {servicio.equipo.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="group rounded-sm border border-primary/10 bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img src={m.img} alt={m.nombre} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-3 md:p-4 text-center">
                      <h4 className="font-sans text-sm md:text-base font-bold text-primary">
                        {m.nombre}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB: Publicaciones y Noticias */}
          {tab === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl"
            >
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="font-sans text-sm md:text-base font-bold text-primary mb-4 flex items-center gap-2">
                    <FileText size={16} className="text-accent" />
                    Publicaciones
                  </h3>
                  {servicio.publicaciones.length === 0 ? (
                    <p className="font-sans text-xs text-text/40">Sin publicaciones por ahora.</p>
                  ) : (
                    <div className="space-y-3">
                      {servicio.publicaciones.map((p, i) => (
                        <div key={i} className="rounded-sm border border-primary/10 bg-white p-4 transition-all hover:shadow-sm hover:border-accent/20 cursor-pointer">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="font-sans text-[8px] uppercase tracking-wider text-accent font-semibold">
                                {p.tipo}
                              </span>
                              <h4 className="font-sans text-xs md:text-sm font-bold text-primary mt-0.5">
                                {p.titulo}
                              </h4>
                            </div>
                            <ChevronRight size={14} className="text-text/20 shrink-0 mt-1" />
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <Calendar size={10} className="text-text/30" />
                            <span className="font-sans text-[9px] text-text/40">{p.fecha}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-sans text-sm md:text-base font-bold text-primary mb-4 flex items-center gap-2">
                    <Gavel size={16} className="text-accent" />
                    Noticias
                  </h3>
                  {servicio.noticias.length === 0 ? (
                    <p className="font-sans text-xs text-text/40">Sin noticias por ahora.</p>
                  ) : (
                    <div className="space-y-3">
                      {servicio.noticias.map((n, i) => (
                        <div key={i} className="rounded-sm border border-primary/10 bg-white p-4 transition-all hover:shadow-sm hover:border-accent/20 cursor-pointer">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-sans text-xs md:text-sm font-bold text-primary">
                              {n.titulo}
                            </h4>
                            <ChevronRight size={14} className="text-text/20 shrink-0 mt-0.5" />
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <Calendar size={10} className="text-text/30" />
                            <span className="font-sans text-[9px] text-text/40">{n.fecha}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-14 md:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/img2.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8"
          >
            <div className="text-center md:text-left">
              <h2 className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2">
                ¿Necesita asesoría en {servicio.title.toLowerCase()}?
              </h2>
              <p className="font-sans text-[10px] sm:text-xs md:text-sm text-white/60 max-w-lg leading-relaxed">
                Contáctenos hoy y agende una consulta con nuestros especialistas en {servicio.title.toLowerCase()}.
              </p>
            </div>
            <Link
              href="/contacto"
              className="inline-flex shrink-0 items-center gap-2 bg-accent text-primary px-5 md:px-7 py-2.5 md:py-3.5 rounded-sm font-sans text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 hover:bg-white active:scale-95 shadow-lg"
            >
              Solicitar consulta
              <ArrowLeft size={12} className="rotate-180 md:h-3.5 md:w-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
