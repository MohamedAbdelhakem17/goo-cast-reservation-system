import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useGetAllFaqs } from "@/apis/admin/manage-faq.api";
import useLocalization from "@/context/localization-provider/localization-context";

export default function Faq() {
  const { lng, t } = useLocalization();
  const [openItem, setOpenItem] = useState(null);
  const { faqs, isLoading } = useGetAllFaqs();

  const toggleItem = useCallback((itemId) => {
    setOpenItem((prev) => (prev === itemId ? null : itemId));
  }, []);

  if (isLoading) return null;

  return (
    <div className="mx-auto w-full py-5">
      <h4 className="mb-3 text-3xl font-semibold text-gray-900">
        {t("frequently-asked-questions")}
      </h4>

      <div className="divide-y-2 divide-gray-200">
        {faqs?.data?.map((faq) => {
          const isOpen = openItem === faq._id;

          return (
            <motion.div
              key={faq._id}
              className="overflow-hidden bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => toggleItem(faq._id)}
                className="flex w-full items-center justify-between py-5 text-left transition-colors duration-200 hover:bg-gray-50 focus:outline-none"
              >
                <span
                  className={`block pr-4 font-medium text-gray-900 ${
                    isOpen ? "underline" : ""
                  }`}
                >
                  {faq.question?.[lng]}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5 text-sm leading-relaxed text-gray-700">
                      {faq.answer?.[lng]}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
