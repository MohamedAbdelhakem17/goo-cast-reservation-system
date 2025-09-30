import { motion } from "framer-motion"
const Popup = ({ children }) => {
    return <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
        <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-xl"
        >
            {children}
        </motion.div>
    </motion.div>
}

export default Popup