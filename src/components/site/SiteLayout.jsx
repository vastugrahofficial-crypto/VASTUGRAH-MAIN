import React from "react";
import Chakra from "@/components/site/Chakra";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingWhatsApp from "@/components/site/FloatingWhatsApp";
import MobileNav from "@/components/site/MobileNav";

export default function SiteLayout({ children }) {
  return (
    <div className="relative min-h-screen">
      <Chakra />
      <Header />
      <main>{children}</main>
      <div className="pb-16 lg:pb-0">
        <Footer />
      </div>
      <FloatingWhatsApp />
      <MobileNav />
    </div>
  );
}