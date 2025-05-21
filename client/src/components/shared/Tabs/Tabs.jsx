import React from "react";
import { motion } from "framer-motion";

const Tabs = ({ tabs, activeTabId, onTabChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: .5,
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8,
      }}
      className="w-full max-w-3xl mx-auto my-4 px-4 md:px-0"
    >
      <div className="relative flex border-b border-main/50 rounded-lg items-center justify-around bg-white shadow-sm">
        {tabs?.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)} // Pass the onTabChange function from the parent
              className={`px-1 md:px-4 py-3 text-sm font-bold relative z-10 transition-colors duration-200 cursor-pointer ${
                isActive ? "text-white" : "text-gray-500 hover:text-gray-700"
              }`}
              aria-selected={isActive}
              role="tab"
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 rounded-t-lg bg-red-600"
                  style={{ zIndex: -1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Tabs;
