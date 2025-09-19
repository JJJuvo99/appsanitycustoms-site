import { motion } from "framer-motion";

interface SkillBarProps {
  name: string;
  percentage: number;
  color: string;
  animate: boolean;
  delay: number;
}

export default function SkillBar({ name, percentage, color, animate, delay }: SkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="skill-item"
      data-testid={`skill-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex justify-between mb-2">
        <span className="font-semibold" data-testid={`skill-name-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          {name}
        </span>
        <span className="text-muted-foreground" data-testid={`skill-percentage-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          {percentage}%
        </span>
      </div>
      <div className="skill-bar h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={animate ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
          className={`h-full ${color} rounded-full`}
          data-testid={`skill-progress-${name.toLowerCase().replace(/\s+/g, '-')}`}
        />
      </div>
    </motion.div>
  );
}
