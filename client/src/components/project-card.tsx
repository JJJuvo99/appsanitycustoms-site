import { motion } from "framer-motion";
import { useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  delay: number;
}

export default function ProjectCard({ title, description, image, tags, delay }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 10,
        rotateX: 5,
        transition: { duration: 0.6, ease: "easeOut" }
      }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="card-3d bg-card border border-border rounded-2xl overflow-hidden shadow-xl"
      style={{ transformStyle: "preserve-3d" }}
      data-testid={`project-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="relative">
        <img
          src={image}
          alt={`${title} project showcase`}
          className={`w-full h-48 object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          data-testid={`project-image-${title.toLowerCase().replace(/\s+/g, '-')}`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3" data-testid={`project-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </h3>
        <p className="text-muted-foreground mb-4" data-testid={`project-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => {
            const colorClasses = [
              "bg-primary/20 text-primary",
              "bg-secondary/20 text-secondary",
              "bg-accent/20 text-accent"
            ];
            return (
              <span
                key={tag}
                className={`px-3 py-1 ${colorClasses[index % colorClasses.length]} rounded-full text-sm`}
                data-testid={`project-tag-${tag.toLowerCase()}`}
              >
                {tag}
              </span>
            );
          })}
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-modern px-4 py-2 rounded-lg text-sm text-primary-foreground"
            data-testid={`button-demo-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            Live Demo
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
            data-testid={`button-github-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            GitHub
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
