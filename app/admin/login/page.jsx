"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/admin/");
      }
      setLoading(false);
    });
    return unsub;
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin/");
    } catch (err) {
      const msg =
        err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential"
          ? "Credenciales incorrectas"
          : err.code === "auth/invalid-email"
          ? "Correo inválido"
          : "Error al iniciar sesión";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-primary overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url(/images/img6.jpg)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="rounded-sm border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="LBV Abogados"
                className="h-8 md:h-10 w-auto brightness-0 invert"
              />
            </div>
            <div className="mx-auto mb-3 h-[2px] w-8 bg-accent" />
            <h1 className="font-sans text-lg md:text-xl font-bold text-white">
              Panel Administrativo
            </h1>
            <p className="font-sans text-[10px] md:text-xs text-white/50 mt-1">
              Inicie sesión para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-sans text-[10px] md:text-xs font-semibold text-white/70 mb-1.5 block">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-2.5 md:py-3 font-sans text-[10px] md:text-sm text-white outline-none transition-all duration-200 placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:ring-1 focus:ring-accent/30"
                placeholder="admin@lbvabogados.pe"
              />
            </div>

            <div>
              <label className="font-sans text-[10px] md:text-xs font-semibold text-white/70 mb-1.5 block">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-2.5 md:py-3 font-sans text-[10px] md:text-sm text-white outline-none transition-all duration-200 placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:ring-1 focus:ring-accent/30 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-accent text-primary px-6 py-3 md:py-3.5 rounded-sm font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all duration-300 hover:bg-white active:scale-[0.98] shadow-lg mt-1"
            >
              Ingresar
              <LogIn size={14} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="font-sans text-[9px] md:text-[10px] text-white/40 hover:text-accent transition-colors"
            >
              ← Volver al sitio
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
