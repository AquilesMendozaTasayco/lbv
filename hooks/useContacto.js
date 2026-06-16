"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const defaults = {
  direccion: "Av. Principal 1234, San Isidro",
  ciudad: "Lima, Perú",
  telefono: "+51 989 592 806",
  email: "contacto@lbvabogados.pe",
  horario: "Lun – Vie: 9:00 am – 6:00 pm\nSáb: 9:00 am – 1:00 pm",
  respuestaRapida: "Nuestro equipo responderá su consulta en un máximo de 24 horas hábiles.",
  mapaSrc: "",
  tiktok: "https://www.tiktok.com/@lbv.abogados",
  linkedin: "https://www.linkedin.com/company/lbv-abogados/",
  instagram: "https://www.instagram.com/lbv_abogados",
  facebook: "https://www.facebook.com/share/1HDWhUbyWn/",
};

export function useContacto() {
  const [data, setData] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "config", "contacto"));
        if (snap.exists()) {
          const d = snap.data();
          setData({
            direccion: d.direccion || defaults.direccion,
            ciudad: d.ciudad || defaults.ciudad,
            telefono: d.telefono || defaults.telefono,
            email: d.email || defaults.email,
            horario: d.horario || defaults.horario,
            respuestaRapida: d.respuestaRapida || defaults.respuestaRapida,
            mapaSrc: d.mapaSrc || "",
            tiktok: d.tiktok || defaults.tiktok,
            linkedin: d.linkedin || defaults.linkedin,
            instagram: d.instagram || defaults.instagram,
            facebook: d.facebook || defaults.facebook,
          });
        }
      } catch { /* usa defaults */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return { data, loading };
}
