import { OptimizedImage } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function StudioCard({ studio }) {
  // Localization
  const { t, lng } = useLocalization();

  // State
  const [scrollDir, setScrollDir] = useState("down");

  // Effects
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDir("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDir("up");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", updateScrollDir);
    return () => window.removeEventListener("scroll", updateScrollDir);
  }, []);

  // 🔹 Animation Variants
  const cardAnimation = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.7,
      rotate: scrollDir === "down" ? 4 : -4,
    },
    whileInView: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8 },
    },
    whileHover: {
      y: -5,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  const imageHover = {
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  const overlayAnimation = {
    initial: { opacity: 0 },
    whileHover: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800"
      initial={cardAnimation.initial}
      whileInView={cardAnimation.whileInView}
      whileHover={cardAnimation.whileHover}
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Studio Image */}
        <div className="relative h-64 overflow-hidden md:h-auto md:w-1/3">
          <motion.div {...imageHover} className="h-full">
            <OptimizedImage
              src={studio.thumbnail}
              alt={studio.name?.[lng]}
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 md:opacity-0 md:hover:opacity-100"
            initial={overlayAnimation.initial}
            whileHover={overlayAnimation.whileHover}
          >
            <div className="p-4 text-white">
              <Link
                to={`/setups/${studio.slug}`}
                className="flex items-center gap-2 text-xl font-semibold"
              >
                <span>{t("view-details-0")}</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Studio Details */}
        <div className="border-main flex-1 border-b-3 p-6">
          <div className="flex items-start justify-between">
            {/* Studio Name */}
            <h3 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {studio.name?.[lng]}
            </h3>

            {/* Studio Location */}
            <p className="mb-3 flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-location-dot text-rose-500"></i>
              <span>{studio.address?.[lng]}</span>
            </p>
          </div>

          {/* Facilities */}
          <div className="my-4 grid grid-cols-2 gap-4">
            {studio.facilities?.[lng].map(
              (facility, index) =>
                index <= 3 && (
                  <div className="flex items-center gap-2" key={index}>
                    <i className="fa-solid fa-ticket"></i>
                    <span className="text-gray-600 dark:text-gray-400">{facility}</span>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
