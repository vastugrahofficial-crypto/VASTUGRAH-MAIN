import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Featured from "@/components/home/Featured";
import AiPortal from "@/components/home/AiPortal";
import Astrologers from "@/components/home/Astrologers";
import ServicesPreview from "@/components/home/ServicesPreview";
import Testimonials from "@/components/home/Testimonials";
import CtaBand from "@/components/home/CtaBand";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Vastugrah | Vedic Astrology & Vastu Shastra" }] }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Featured />
      <AiPortal />
      <Astrologers />
      <ServicesPreview />
      <Testimonials />
      <CtaBand />
    </>
  );
}