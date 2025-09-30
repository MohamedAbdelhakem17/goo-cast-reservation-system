import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLocalization from "@/context/localization-provider/localization-context";

export default function Header({ title, location }) {
  const { t, lng } = useLocalization();
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.section className="p-2" initial="hidden" animate="show" variants={container}>
      {/* Back Button */}
      <motion.div variants={item}>
        <Link
          to="/setups"
          className="hover:text-main group mb-4 font-medium text-gray-600 transition-colors duration-300"
        >
          <motion.div
            whileHover={{ x: -3 }}
            whileTap={{ x: -6 }}
            className={`mb-4 flex items-center gap-2 ${lng === "ar" ? "flex-row-reverse" : "flex-row"} me-auto w-fit`}
          >
            <i className="fa-solid fa-caret-left"></i>
            <span className="text-sm font-bold">{t("go-back-to-setups")}</span>
          </motion.div>
        </Link>
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={item}
        className="text-main text-3xl font-extrabold md:text-4xl"
      >
        {title}
      </motion.h1>

      {/* Info */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-x-8 py-1">
        {/* Studio Location */}
        <motion.p
          className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-gray-600"
          whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
        >
          <i className="fa-solid fa-location-dot"></i>
          <span className="text-base font-medium">{location}</span>
        </motion.p>

        {/* Studio Rating */}
        {/* <motion.div
                    className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full"
                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                >
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    <span className="text-gray-700 font-bold">{rate.toFixed(1)}</span>
                </motion.div> */}
      </motion.div>
    </motion.section>
  );
}
