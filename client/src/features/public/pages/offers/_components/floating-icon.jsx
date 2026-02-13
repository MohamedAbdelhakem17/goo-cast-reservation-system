import { motion } from "framer-motion";
import { Moon, Sparkles, Star } from "lucide-react";

function Icon({ children, className }) {
  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const x = randomBetween(-30, 30);
  const y = randomBetween(-40, 40);
  const rotate = randomBetween(-10, 10);
  const duration = randomBetween(6, 12);

  return (
    <motion.div
      className={className}
      animate={{
        x: [0, x, 0],
        y: [0, y, 0],
        rotate: [0, rotate, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export default function FloatingIcon() {
  return (
    <>
      <Icon className="absolute top-10 left-5 opacity-20 md:block lg:left-10">
        <Moon size={48} className="md:h-16 md:w-16" />
      </Icon>

      <Icon className="absolute top-20 right-16 opacity-15 lg:block">
        <Star size={48} />
      </Icon>

      <Icon className="absolute bottom-30 left-10 opacity-10 md:block lg:left-20">
        <Sparkles size={32} className="md:h-10 md:w-10" />
      </Icon>

      <Icon className="absolute right-5 bottom-0 opacity-20 md:block lg:right-10">
        <Moon size={56} className="md:h-16 md:w-16 lg:h-18 lg:w-18" />
      </Icon>
    </>
  );
}
