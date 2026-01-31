import { useGetAllPackages } from "@/apis/admin/manage-package.api";
import { OptimizedImage } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { Check, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const iconVariants = {
  hover: {
    rotate: 360,
    scale: 1.1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const AnimatedList = ({ items, delay }) => (
  <ul className="space-y-2">
    {items?.map((item, idx) => (
      <motion.li
        key={idx}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + idx * 0.1 }}
        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
      >
        <Check className="text-main mt-0.5 h-4 w-4 flex-shrink-0" />
        <span>{item}</span>
      </motion.li>
    ))}
  </ul>
);

export default function PackagesSection() {
  // Localization
  const { t, lng } = useLocalization();

  // Query
  const { packages } = useGetAllPackages(true);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center py-8">
      {/* Header */}
      <div className="relative mb-6 flex flex-col items-center text-center">
        <span className="text-main mb-2 text-sm font-medium tracking-widest uppercase">
          {t("packages")}
        </span>
        <h2 className="text-main mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          {t("our-packages")}
        </h2>
        <div className="mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-rose-300 to-rose-500"></div>
        <p className="max-w-lg text-sm text-gray-600 md:text-base dark:text-gray-400">
          {t(
            "choose-from-a-variety-of-packages-tailored-to-fit-your-creative-needs-and-budget",
          )}
        </p>
      </div>

      {packages?.data?.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          {t("no-packages-available-at-the-moment")}
        </p>
      ) : (
        <div className="container mx-auto px-4 py-3">
          <motion.div
            className="mx-auto flex max-w-6xl flex-col gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {packages?.data?.map((packageItem) => {
              return (
                <motion.div
                  key={packageItem._id}
                  variants={cardVariants}
                  whileHover={{ y: -3 }}
                  className="group w-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
                >
                  {/* Wrapper for image and content */}
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    {/* Image section */}
                    <div className="relative h-60 w-full overflow-hidden md:h-auto md:w-1/2">
                      <OptimizedImage
                        src={packageItem.image || "/placeholder.svg"}
                        alt={packageItem.name?.[lng]}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          <Clock className="mr-1 h-3 w-3" />
                          {packageItem.session_type?.[lng]}
                        </div>
                      </div>
                    </div>

                    {/* Text content section */}
                    <div className="flex flex-col justify-between p-6 md:w-1/2">
                      <div>
                        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {packageItem.name?.[lng]}
                        </h3>
                        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {packageItem.description?.[lng]}
                        </p>
                        {/* Target Audience */}
                        {packageItem.target_audience?.[lng]?.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {packageItem.target_audience?.[lng].map((audience, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition-none dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-300"
                              >
                                <Users className="me-1 h-3 w-3" />
                                {audience}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Package Details */}
                        {packageItem.details?.[lng]?.length > 0 && (
                          <div className="mb-4">
                            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {t("whats-included")}:
                            </h4>
                            <AnimatedList
                              items={packageItem.details?.[lng]}
                              delay={0.2}
                            />
                          </div>
                        )}
                        {/* Post Session Benefits */}
                        {packageItem.post_session_benefits?.[lng]?.length > 0 && (
                          <div>
                            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {t("after-your-session")}:
                            </h4>
                            <AnimatedList
                              items={packageItem.post_session_benefits?.[lng]}
                              delay={0.3}
                            />
                          </div>
                        )}
                      </div>

                      {/* Book Now Button */}
                      <div className="mt-6">
                        <Link
                          to="/booking"
                          className="bg-main block w-full rounded-full px-5 py-3 text-center text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-rose-600 hover:shadow-lg"
                        >
                          {t("book-now")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}
    </section>
  );
}
