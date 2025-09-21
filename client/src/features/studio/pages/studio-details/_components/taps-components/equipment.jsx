import React from "react";
import { motion } from "framer-motion";
export default function Equipment({ equipment }) {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const listItemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-white px-6 py-8 shadow-sm">
      <div className="mb-4 flex items-center">
        <i className="fa-solid fa-photo-film text-main me-2 text-2xl"></i>
        <motion.h2
          className="text-2xl font-bold text-gray-800"
          whileHover={{ scale: 1.02 }}
        >
          Equipment
        </motion.h2>
      </div>
      <motion.ul className="space-y-3 text-gray-600" variants={listVariants}>
        {equipment?.map((rule, index) => (
          <motion.li
            key={index}
            className="flex items-start"
            variants={listItemVariants}
            whileHover={{ x: 5, color: "#f43f5e" }}
          >
            <span className="mt-2 mr-2 inline-block h-2 w-2 rounded-full bg-rose-500"></span>
            {rule}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
