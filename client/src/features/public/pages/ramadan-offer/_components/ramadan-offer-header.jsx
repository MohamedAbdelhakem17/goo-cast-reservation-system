import { motion } from "framer-motion";
import { Flame, Moon, Sparkles, Star } from "lucide-react";
import FloatingIcon from "./floating-icon";

export default function RamadanOfferHeader({ badge, title, description, onBookNow }) {
  const titleParts = title ? title.split(" ") : ["Ramadan", "Special Bundle"];

  return (
    <div className="relative overflow-hidden px-4 py-8 text-center sm:px-6 md:px-8 md:py-12 lg:py-16">
      {/* Floating Icons (Hidden on small screens) */}
      <FloatingIcon className="absolute top-10 left-5 opacity-20 md:block lg:left-10">
        <Moon size={48} className="md:h-16 md:w-16" />
      </FloatingIcon>

      <FloatingIcon className="absolute top-20 right-16 opacity-15 lg:block">
        <Star size={48} />
      </FloatingIcon>

      <FloatingIcon className="absolute bottom-32 left-10 opacity-10 md:block lg:left-20">
        <Sparkles size={32} className="md:h-10 md:w-10" />
      </FloatingIcon>

      <FloatingIcon className="absolute right-5 bottom-20 opacity-20 md:block lg:right-10">
        <Moon size={56} className="md:h-16 md:w-16 lg:h-18 lg:w-18" />
      </FloatingIcon>

      {/* Badge */}
      <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 sm:px-4 sm:py-2 md:mb-6 dark:border-yellow-600 dark:bg-yellow-900/30">
        <Flame className="text-yellow-500 dark:text-yellow-400" size={16} />
        <span className="text-xs font-medium text-yellow-600 sm:text-sm dark:text-yellow-400">
          {badge || "Limited Time Offer"}
        </span>
      </div>

      {/* Title */}
      <h1 className="relative z-10 mb-2 px-2 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
        <span className="block text-gray-800 dark:text-white">{titleParts[0]}</span>
        <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          {titleParts.slice(1).join(" ")}
        </span>
      </h1>

      {/* Description */}
      <p className="relative z-10 mx-auto mt-4 max-w-xl px-4 text-base leading-relaxed text-gray-500 sm:text-lg md:mt-6 md:max-w-2xl md:text-xl dark:text-gray-400">
        {description ||
          "Get 40 studio hours plus professional services at an unprecedented rate this Ramadan month."}
      </p>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBookNow}
        className="relative z-10 mt-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-shadow duration-300 hover:shadow-xl sm:px-8 sm:py-4 sm:text-base md:mt-8"
      >
        Book Now
      </motion.button>
    </div>
  );
}
