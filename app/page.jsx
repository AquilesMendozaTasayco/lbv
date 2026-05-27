import Hero from "@/components/home/Hero";
import NosotrosPreview from "@/components/home/NosotrosPreview";
import ContactCta from "@/components/home/ContactCta";
import PorQueElegirnos from "@/components/home/PorQueElegirnos";
import ServiciosPreview from "@/components/home/ServiciosPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NosotrosPreview />
      <ContactCta />
      <ServiciosPreview />
      <PorQueElegirnos />
    </>
  );
}
