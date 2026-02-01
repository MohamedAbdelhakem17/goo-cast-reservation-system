import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useGetStudio } from "@/apis/public/studio.api";
import { Loading, OptimizedImage } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};
export default function Studio() {
  // Localization
  const { t, lng } = useLocalization();

  // Query
  const { data: studiosData, isLoading } = useGetStudio(true);

  // Loading State
  if (isLoading) <Loading />;

  return (
    <section className="my-8 py-8">
      {/* Header */}
      <div className="relative mb-12 flex flex-col items-center">
        {/* subtitle */}
        <span className="text-main mb-2 text-sm font-medium tracking-widest uppercase">
          {t("setups")}
        </span>

        {/* Title */}
        <h2 className="text-main mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          {t("our-setups")}
        </h2>
        <div className="mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-rose-300 to-rose-500"></div>

        {/* Description */}
        <p className="max-w-lg text-center text-sm text-gray-600 md:text-base">
          {t(
            "explore-our-beautifully-designed-setups-equipped-with-the-latest-gear-to-make-your-shoot-perfect",
          )}
        </p>
      </div>

      {/* Studios  */}
      <motion.div
        className="flex flex-wrap items-stretch justify-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Display data */}
        {studiosData?.data?.map((studio) => (
          <motion.div
            key={studio.id}
            className="flex w-full max-w-[400px] flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl sm:w-[90%] md:w-[45%] lg:w-[30%] xl:w-[28%]"
            variants={itemVariants}
            whileHover={{
              y: -10,
              transition: { type: "spring", stiffness: 300 },
            }}
          >
            {/* Studio Image with hover effect */}
            <motion.div
              className="relative h-64 overflow-hidden"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              {/* Image */}
              <OptimizedImage
                src={studio.thumbnail || "/placeholder.svg"}
                alt={studio.name?.[lng]}
                className="h-full w-full object-cover"
              />

              <motion.div
                className="from-main/30 absolute inset-0 flex items-end bg-gradient-to-t to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="px-8 py-4 text-white">
                  {/* Studio link */}
                  <Link to={`/setups/${studio.slug}`} className="font-bold">
                    {t("view-details")}
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Studio Name and Location */}
            <div className="flex flex-grow flex-col justify-between p-4">
              {/* Studio name */}
              <h3 className="text-xl font-bold text-gray-800 transition-none dark:text-gray-100">
                {studio.name?.[lng]}
              </h3>

              {/* Studio location */}
              <p className="mt-2 flex items-center gap-2 text-gray-600 transition-none dark:text-gray-300">
                <i className="fa-solid fa-location-dot text-main"></i>
                <span className="text-lg">{studio.address?.[lng]}</span>
              </p>

              {/* Red line */}
              <motion.div
                className="bg-main mt-3 h-1 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
