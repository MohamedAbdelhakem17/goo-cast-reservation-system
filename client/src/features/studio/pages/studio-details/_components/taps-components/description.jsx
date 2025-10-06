import { motion } from "framer-motion";

export default function Description({ description }) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="mx-auto max-w-3xl rounded-xl bg-white px-6 py-8 shadow-sm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="border-main/30 mb-8 rounded-lg border-t border-b py-6"
        variants={itemVariants}
      >
        {description && (
          <div
            className="[&_h2]:text-main [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-2 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:font-medium [&_p]:text-gray-800"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
