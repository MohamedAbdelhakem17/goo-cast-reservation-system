import React from "react";
import { motion } from "framer-motion";
import useLocalization from "@/context/localization-provider/localization-context";

export default function DurationInput({
  handleDecrement,
  duration,
  handleIncrement,
  disabled = false,
}) {
  // Localization
  const { t } = useLocalization();

  return (
    <>
      {/* Duration Selector */}
      <div className="mb-5 flex flex-col items-center justify-between gap-3 md:flex-row">
        {/* Title */}
        <p className="text-lg font-semibold text-gray-700">
          {t("session-duration-hours")}
        </p>

        {/* Duration controller container */}
        <div className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-gray-50 shadow-sm">
          {/* Decrement duration button*/}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDecrement}
            disabled={disabled}
            className="flex h-10 w-10 items-center justify-center border-r border-gray-200 bg-gray-100 text-gray-700 transition hover:bg-gray-200 active:outline-0 disabled:opacity-40"
          >
            <i className="fa-solid fa-minus"></i>
          </motion.button>

          {/* Duration value */}
          <div className="flex h-10 w-16 items-center justify-center bg-white text-center text-base font-semibold text-gray-800">
            {duration}
          </div>

          {/* Increment duration button*/}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleIncrement}
            disabled={disabled}
            className="flex h-10 w-10 items-center justify-center border-l border-gray-200 bg-gray-100 text-gray-700 transition hover:bg-gray-200 active:outline-0 disabled:opacity-40"
          >
            <i className="fa-solid fa-plus"></i>
          </motion.button>
        </div>
      </div>
    </>
  );
}
