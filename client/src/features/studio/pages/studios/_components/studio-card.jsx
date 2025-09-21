import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";

export default function StudioCard({ studio, key }) {
  const { t, lng } = useLocalization();
  const [scrollDir, setScrollDir] = useState("down");

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

  return (
    <motion.div
      key={key}
      className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
      whileHover={{
        y: -5,
        transition: { type: "spring", stiffness: 300 },
      }}
      initial={{
        opacity: 0,
        y: 50,
        scale: 0.7,
        rotate: scrollDir === "down" ? 4 : -4,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
      }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Studio Image */}
        <div className="relative h-64 overflow-hidden md:h-auto md:w-1/3">
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
            className="h-full"
          >
            <OptimizedImage
              src={studio.thumbnail}
              alt={studio.name?.[lng]}
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 md:opacity-0 md:hover:opacity-100"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
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
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-800">
                {studio.name?.[lng]}
              </h3>
              <p className="mb-3 flex items-center gap-2 text-gray-600">
                <i className="fa-solid fa-location-dot text-rose-500"></i>
                <span>{studio.address?.[lng]}</span>
              </p>
            </div>
          </div>

          <div className="my-4 grid grid-cols-2 gap-4">
            {studio.facilities.map(
              (facility, index) =>
                index <= 3 && (
                  <div className="flex items-center gap-2" key={index}>
                    <i className="fa-solid fa-ticket"></i>
                    <span className="text-gray-600">{facility}</span>
                  </div>
                ),
            )}
          </div>

          <div className="mt-4 flex flex-col justify-between border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
            <p className="mb-4 text-2xl font-bold text-rose-500 sm:mb-0">
              {/* {priceFormat(studio.pricePerHour || studio.basePricePerSlot)}  per hour */}
            </p>

            <div className="flex gap-3">
              {/* <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i className="fa-solid fa-bookmark mr-2"></i>
                        Save
                      </button> */}
              {/* <button
                        onClick={() => handleQuickBooking(2, {
                          image: studio.thumbnail,
                          name: studio.name,
                          price: studio.basePricePerSlot,
                          id: studio._id,
                        })}
                        className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        Book Now
                      </button> */}
            </div>
          </div>

          <motion.div
            className="bg-main mt-4 h-1 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </motion.div>
  );
}
