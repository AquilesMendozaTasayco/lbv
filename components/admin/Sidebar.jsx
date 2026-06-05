"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard, LogOut, ChevronRight, ChevronLeft,
  Image as ImageIcon, MapPin,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";


const items = [
  { label: "Panel de Control", href: "/admin/", icon: LayoutDashboard },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Contacto", href: "/admin/contacto", icon: MapPin },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Está a punto de salir del panel de administración",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      if (isLoggingOut) return;
      try {
        setIsLoggingOut(true);
        await signOut(auth);
        router.push("/admin/login");
      } catch { console.error(); }
      finally { setIsLoggingOut(false); }
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "80px" : "280px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 h-screen flex-shrink-0 bg-primary border-r border-white/10 flex flex-col z-50"
    >
      {/* Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-10 z-[60] flex h-7 w-7 items-center justify-center rounded-full bg-accent text-primary shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center overflow-hidden px-4 pt-8">
        <div className={`relative mb-4 transition-all duration-300 ${isCollapsed ? "h-10 w-10" : "h-14 w-28"}`}>
          <img
            src="/logo.png"
            alt="LBV"
            className="h-full w-full object-contain brightness-0 invert"
          />
        </div>
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap text-center">
            <h2 className="font-sans text-sm font-bold uppercase tracking-[0.15em] text-white">
              LBV <span className="text-accent">Abogados</span>
            </h2>
            <p className="font-sans text-[10px] text-white/40 mt-0.5">
              Administración
            </p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto px-3">
        {!isCollapsed && (
          <p className="mb-3 whitespace-nowrap px-4 font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Menú
          </p>
        )}

        {items.map((it) => {
          const active =
            it.href === "/admin/"
              ? pathname === "/admin" || pathname === "/admin/"
              : pathname === it.href || pathname.startsWith(it.href + "/");
          const Icon = it.icon;

          return (
            <Link key={it.href} href={it.href}
              className={`group relative flex items-center rounded-sm transition-all duration-200
                ${isCollapsed ? "justify-center px-0 py-3.5" : "justify-between px-4 py-3"}
                ${active ? "bg-accent/10 text-accent" : "text-white/50 hover:bg-white/5 hover:text-white"}
              `}
            >
              {active && !isCollapsed && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
              )}

              <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center rounded-sm transition-all duration-200
                  ${isCollapsed ? "h-9 w-9" : "h-8 w-8"}
                  ${active ? "bg-accent/15 text-accent" : "text-white/40 group-hover:bg-white/5 group-hover:text-accent"}
                `}>
                  <Icon size={isCollapsed ? 20 : 17} />
                </span>
                {!isCollapsed && (
                  <span className={`whitespace-nowrap font-sans text-sm tracking-tight transition-colors duration-200
                    ${active ? "font-bold text-white" : "font-medium group-hover:text-white"}
                  `}>
                    {it.label}
                  </span>
                )}
              </div>

              {!isCollapsed && active && (
                <motion.div layoutId="activeIndicator"
                  className="h-1.5 w-1.5 rounded-full bg-accent" />
              )}

              {isCollapsed && (
                <div className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-sm bg-white px-2.5 py-1.5 font-sans text-[10px] font-bold text-primary opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                  {it.label}
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-white/10 p-3">
        <button onClick={handleLogout} disabled={isLoggingOut}
          className={`flex w-full items-center rounded-sm px-4 py-3 text-white/40 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 group ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <LogOut size={17} className={`shrink-0 transition-transform duration-200 ${isLoggingOut ? "animate-pulse" : "group-hover:-translate-x-0.5"}`} />
          {!isCollapsed && (
            <span className="whitespace-nowrap font-sans text-[11px] font-bold uppercase tracking-widest">
              {isLoggingOut ? "SALIENDO..." : "Cerrar sesión"}
            </span>
          )}
        </button>

        <div className={`mt-3 flex flex-col items-center transition-all duration-300 ${isCollapsed ? "opacity-40" : "opacity-100"}`}>
          <p className="font-sans text-[8px] text-white/20 uppercase tracking-[0.2em]">
            LBV Abogados &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
