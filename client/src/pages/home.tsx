import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import PortfolioSection from "@/components/portfolio-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Set page title and meta description
    document.title = "App Sanity Customs - Creative Developer | Modern Web Experiences";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Award-winning creative developer specializing in 3D web experiences, interactive animations, and modern UI/UX design. Let's build something extraordinary together.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Award-winning creative developer specializing in 3D web experiences, interactive animations, and modern UI/UX design. Let's build something extraordinary together.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
