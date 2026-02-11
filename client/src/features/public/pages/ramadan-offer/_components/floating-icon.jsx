import { motion } from "framer-motion";

function FloatingIcon({ children, className }) {
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

export default FloatingIcon;
