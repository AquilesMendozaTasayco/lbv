"use client";

import { FaWhatsapp } from "react-icons/fa";

const PHONE = "51999888777";
const MESSAGE = "Hola, quisiera consultar con LBV Abogados";

export default function WhatsAppButton() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
      aria-label="WhatsApp"
    >
      <FaWhatsapp size={32} />
    </a>
  );
}
