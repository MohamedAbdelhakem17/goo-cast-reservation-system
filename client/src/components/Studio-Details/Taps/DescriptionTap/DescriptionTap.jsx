import { motion } from "framer-motion"

export default function DescriptionTap() {
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

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const listItemVariants = {
        hidden: { x: -10, opacity: 0 },
        visible: {
            x: 0,
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
            <motion.div className="mb-8 border-b pb-6 border-main/30" variants={itemVariants}>
                <div className="flex items-center mb-4">
                    <i className="fa-solid fa-camera text-main text-2xl mr-2"></i>
                    <motion.h2 className="text-2xl font-bold text-gray-800" whileHover={{ scale: 1.02 }}>
                        About the Studio
                    </motion.h2>
                </div>
                <motion.p className="text-gray-600 leading-relaxed" variants={itemVariants}>
                    The Creativity Studio is a professional space equipped with the latest photography equipment. The studio
                    provides an ideal environment for both professional and amateur photographers. The studio is carefully
                    designed to provide optimal lighting and a variety of backdrops for all types of photography.
                </motion.p>
            </motion.div>

            <motion.div className="mb-8 border-b pb-6 border-main/30" variants={itemVariants}>
                <div className="flex items-center mb-4">
                    <i className="fa-solid fa-ruler  text-main text-2xl mr-2"></i>
                    <motion.h2 className="text-2xl font-bold text-gray-800" whileHover={{ scale: 1.02 }}>
                        Area
                    </motion.h2>
                </div>
                <motion.p className="text-gray-600 leading-relaxed" variants={itemVariants}>
                    The studio is 100 square meters, with a ceiling height of 4 meters, providing ample space for free
                    photography.
                </motion.p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <div className="flex items-center mb-4">
                    <i className="fa-solid fa-scroll  text-main text-2xl mr-2"></i>
                    <motion.h2 className="text-2xl font-bold text-gray-800" whileHover={{ scale: 1.02 }}>
                        Studio Rules
                    </motion.h2>
                </div>

                <motion.ul className="space-y-3 text-gray-600" variants={listVariants}>
                    {[
                        "Reservations must be made at least 24 hours in advance.",
                        "Smoking is prohibited inside the studio.",
                        "The space must be kept clean.",
                        "Pets are not allowed.",
                        "If any equipment is damaged, the customer will bear the cost of repair or replacement.",
                    ].map((rule, index) => (
                        <motion.li
                            key={index}
                            className="flex items-start"
                            variants={listItemVariants}
                            whileHover={{ x: 5, color: "#f43f5e" }}
                        >
                            <span className="inline-block w-2 h-2 mt-2 mr-2 bg-rose-500 rounded-full"></span>
                            {rule}
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.div>
        </motion.div>
    )
}

