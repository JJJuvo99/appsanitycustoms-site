import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FloatingShapes() {
  const isMobile = useIsMobile();
  const shapes = [
    {
      className: "w-20 h-20 gradient-bg rounded-lg opacity-20",
      initial: { x: "25vw", y: "25vh" },
      animate: {
        y: ["25vh", "20vh", "30vh"],
        rotateX: [0, 10, -10, 0],
        rotateY: [0, 120, 240, 360],
      },
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    },
    {
      className: "w-16 h-16 bg-secondary rounded-full opacity-30",
      initial: { x: "75vw", y: "50vh" },
      animate: {
        y: ["50vh", "40vh", "55vh"],
        rotateX: [0, -10, 10, 0],
        rotateY: [0, 180, 360],
      },
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: -2 }
    },
    {
      className: "w-12 h-12 bg-accent rounded-lg rotate-45 opacity-25",
      initial: { x: "33vw", y: "66vh" },
      animate: {
        y: ["66vh", "60vh", "70vh"],
        rotateX: [0, 15, -15, 0],
        rotateY: [0, 90, 180, 270, 360],
        rotate: [45, 90, 135, 180, 225],
      },
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: -4 }
    }
  ];

  // Don't render shapes on mobile for performance
  if (isMobile) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute floating-shape ${shape.className}`}
          style={{ transformStyle: "preserve-3d" }}
          initial={shape.initial}
          animate={shape.animate}
          transition={shape.transition}
          data-testid={`floating-shape-${index}`}
        />
      ))}
    </div>
  );
}
