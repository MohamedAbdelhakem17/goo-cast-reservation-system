import { useAuthModel } from "../../../context/Auth-Model-Context/AuthModelContext"
import { motion, AnimatePresence } from "framer-motion";

export default function MobileToggle() {
    const { isMobileMenuOpen, setIsMobileMenuOpen } = useAuthModel()
    return (
        <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
            <motion.button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                whileTap={{ scale: 0.9 }}
                className="p-1"
            >
                <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                        <motion.i
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            className="fa-solid fa-xmark text-2xl"
                        />
                    ) : (
                        <motion.i
                            key="menu"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            className="fa-solid fa-bars text-2xl"
                        />
                    )}
                </AnimatePresence>
            </motion.button>
        </motion.div>
    )
}
