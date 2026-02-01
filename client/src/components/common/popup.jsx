import { motion } from "framer-motion";
const Popup = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 px-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
        className="rounded-lg bg-white p-6 shadow-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Popup;
