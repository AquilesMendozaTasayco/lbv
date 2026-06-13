import Hero from "@/components/home/Hero";
import NosotrosPreview from "@/components/home/NosotrosPreview";
import ContactCta from "@/components/home/ContactCta";
import ServiciosPreview from "@/components/home/ServiciosPreview";
import UltimasPublicaciones from "@/components/home/UltimasPublicaciones";
import UltimasNoticias from "@/components/home/UltimasNoticias";
import EquipoPreview from "@/components/home/EquipoPreview";
import PorQueElegirnos from "@/components/home/PorQueElegirnos";

export default function HomePage() {
  return (
    <>
      <Hero />
      <UltimasPublicaciones />
      <NosotrosPreview />
      <ContactCta />
      <ServiciosPreview />
      <UltimasNoticias />
      <EquipoPreview />
      <PorQueElegirnos />
    </>
  );
}
