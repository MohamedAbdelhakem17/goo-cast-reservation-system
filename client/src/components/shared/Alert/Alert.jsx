import { motion } from "framer-motion";
const Alert = ({ type, children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`"fixed top-4 left-[100%] w-fit text-white px-6 py-3 rounded-lg shadow-lg" ${type === "success" ? "bg-green-500" : "bg-main"}`}
        >
            {children}
        </motion.div>
    );
}

export default Alert