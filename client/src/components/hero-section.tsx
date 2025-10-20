import { motion } from "framer-motion";
import FloatingShapes from "./floating-shapes";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <FloatingShapes />
      
      <div className="absolute inset-0 z-0">
        <spline-viewer 
          url="https://prod.spline.design/B8iJJlqBl181HUNw/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        ></spline-viewer>
      </div>
      
      <div className="max-w-4xl mx-auto text-center px-6 z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold mb-6 text-gradient leading-tight"
          data-testid="hero-title"
        >
          Creative Developer
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          data-testid="hero-description"
        >
          Building immersive digital experiences with cutting-edge technology and creative vision
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection("portfolio")}
            className="btn-modern px-8 py-4 rounded-full text-primary-foreground font-semibold text-lg"
            data-testid="button-view-work"
          >
            View My Work
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection("contact")}
            className="px-8 py-4 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            data-testid="button-get-in-touch"
          >
            Get In Touch
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-muted-foreground"
        data-testid="scroll-indicator"
      >
        <i className="fas fa-chevron-down text-2xl"></i>
      </motion.div>
    </section>
  );
}
