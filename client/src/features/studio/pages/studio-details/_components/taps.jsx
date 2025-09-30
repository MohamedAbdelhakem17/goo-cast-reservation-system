import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Description from "./taps-components/description";
import Facilities from "./taps-components/facilities";
import Equipment from "./taps-components/equipment";
import useLocalization from "@/context/localization-provider/localization-context";

export default function Taps({ description, facilities, equipment }) {
  const { t } = useLocalization();
  const tabs = [
    {
      label: t("description"),
      id: 1,
      content: <Description description={description} />,
    },
    { label: t("facilities"), id: 2, content: <Facilities facilities={facilities} /> },
    { label: t("equipment"), id: 3, content: <Equipment equipment={equipment} /> },
  ];

  const defaultTabId = 1;
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  return (
    <>
      {/* Tab Header */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15,
          mass: 0.8,
        }}
        className="mx-auto my-4 w-full max-w-3xl px-4 md:px-0"
      >
        <div className="border-main/50 relative flex items-center justify-around rounded-lg border-b bg-white shadow-sm">
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`relative z-10 cursor-pointer px-1 py-3 text-sm font-bold transition-colors duration-200 md:px-4 ${
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

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.2 }}
        className="relative mt-4 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTabId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 200, transition: { duration: 0.5 } }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="p-4"
          >
            {activeTab.content}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
}
