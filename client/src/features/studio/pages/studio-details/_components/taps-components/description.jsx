import { motion } from "framer-motion"

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
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    }




    return (
        <motion.div
            className="max-w-3xl mx-auto px-6 py-8 bg-white rounded-xl shadow-sm"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div className="mb-8 border-b  border-t py-6 rounded-lg border-main/30" variants={itemVariants}>
                {description && <div 
                className="[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-main [&_p]:text-sm [&_p]:text-gray-800 [&_p]:mt-2 [&_p]:leading-relaxed [&_p]:font-medium"
                dangerouslySetInnerHTML={{ __html: description }} />}
            </motion.div>
        </motion.div >
    )
}

