import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import ProjectCard from "./project-card";

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const projects = [
    {
      title: "3D Dashboard",
      description: "Interactive 3D data visualization dashboard with WebGL rendering and real-time analytics.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      tags: ["React", "Three.js", "WebGL"],
      demoUrl: "https://threejs.org/examples/#webgl_animation_cloth",
      githubUrl: "https://github.com/mrdoob/three.js"
    },
    {
      title: "E-Commerce AR",
      description: "Augmented reality shopping experience with 3D product previews and virtual try-on features.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      tags: ["React Native", "ARKit", "Node.js"],
      demoUrl: "https://immersive-web.github.io/webxr-samples/",
      githubUrl: "https://github.com/immersive-web/webxr-samples"
    },
    {
      title: "Creative Studio",
      description: "Interactive portfolio website with particle systems, 3D animations, and dynamic content loading.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      tags: ["Vue.js", "GSAP", "Canvas"],
      demoUrl: "https://greensock.com/showcase/",
      githubUrl: "https://github.com/greensock/GSAP"
    }
  ];

  return (
    <section id="portfolio" className="py-20 px-6 bg-muted/20" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-center mb-16 text-gradient"
          data-testid="portfolio-title"
        >
          Featured Projects
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              image={project.image}
              tags={project.tags}
              delay={index * 0.2}
              demoUrl={project.demoUrl}
              githubUrl={project.githubUrl}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-modern px-8 py-4 rounded-full text-primary-foreground font-semibold no-underline inline-block"
            data-testid="button-view-all-projects"
          >
            View All Projects
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
