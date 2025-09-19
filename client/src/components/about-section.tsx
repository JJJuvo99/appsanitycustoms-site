import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import SkillBar from "./skill-bar";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const [imageLoaded, setImageLoaded] = useState(false);

  const skills = [
    { name: "React & Three.js", percentage: 95, color: "gradient-bg" },
    { name: "UI/UX Design", percentage: 90, color: "bg-secondary" },
    { name: "WebGL & GLSL", percentage: 85, color: "bg-accent" },
  ];

  return (
    <section id="about" className="py-20 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-center mb-16 text-gradient"
          data-testid="about-title"
        >
          About Me
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
                alt="Professional developer portrait"
                className={`rounded-2xl shadow-2xl w-full max-w-md mx-auto transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                data-testid="about-image"
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted rounded-2xl animate-pulse" />
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed" data-testid="about-description">
              I'm a passionate creative developer with 5+ years of experience crafting digital experiences that blend stunning visuals with seamless functionality. I specialize in 3D web development, interactive animations, and modern UI/UX design.
            </p>
            
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  percentage={skill.percentage}
                  color={skill.color}
                  animate={isInView}
                  delay={0.6 + index * 0.2}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
