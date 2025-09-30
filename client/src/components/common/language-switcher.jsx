import { motion } from "framer-motion";
import { Globe } from "lucide-react";

function LanguageSwitcher({ lng, changeLanguage }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => changeLanguage(lng === "ar" ? "en" : "ar")}
      className={`focus:ring-main flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm transition-all duration-300 hover:bg-gray-100 focus:ring-2 focus:outline-none ${lng === "en" ? "font-arabic" : ""} `}
    >
      <Globe className="h-4 w-4 text-gray-700" />
      <span>{lng === "ar" ? "English" : "عربى"}</span>
    </motion.button>
  );
}

export default LanguageSwitcher;
