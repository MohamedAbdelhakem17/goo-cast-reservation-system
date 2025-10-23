import { motion } from "framer-motion"
import useTimeConvert from "@/hooks/useTimeConvert"

export default function SlotButton({ time, isSelected, onClick, index }) {
    const timeFormat = useTimeConvert()
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: Math.min(index * 0.05, 0.5),
                duration: 0.3,
            }}
            onClick={() => onClick(time)}
            className={`w-full p-4 text-center border-2 rounded-lg transition-all duration-200 hover:shadow-md ${isSelected
                    ? "border-main/50 bg-main/10 text-main/70"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <span className="text-lg font-medium">{timeFormat(time)}</span>
        </motion.button>
    )
}
