import React from "react";
import { GetPackagesByCategory } from "@/apis/services/services.api";
import { useEffect } from "react";
import { Check, Video, Mic, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { OptimizedImage } from "@/components/common";

export default function PackagesSection() {
  const { mutate: getPackages, data: packages } = GetPackagesByCategory();

  useEffect(() => {
    getPackages({ category: "681c913473e625151f4f075d" });
  }, [getPackages]);

  const getIcon = (iconType) => {
    switch (iconType) {
      case "video":
        return <Video className="h-6 w-6" />;
      case "microphone":
        return <Mic className="h-6 w-6" />;
      default:
        return <Video className="h-6 w-6" />;
    }
  };

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

  return (
    <section className="flex min-h-screen flex-col items-center justify-center py-8">
      {/* Header */}
      <div className="relative mb-12 flex flex-col items-center text-center">
        <span className="text-main mb-2 text-sm font-medium tracking-widest uppercase">
          Packages
        </span>
        <h2 className="text-main mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          Our Packages
        </h2>
        <div className="mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-rose-300 to-rose-500"></div>
        <p className="max-w-lg text-sm text-gray-600 md:text-base">
          Choose from a variety of packages tailored to fit your creative needs and
          budget.
        </p>
      </div>

      {packages?.data?.length === 0 ? (
        <p className="text-center text-gray-500">No packages available at the moment.</p>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {packages?.data?.map((packageItem, index) => (
              <motion.div
                key={packageItem._id}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                {/* Header with Image */}
                <div className="relative h-64 overflow-hidden">
                  <motion.div
                    variants={imageVariants}
                    whileHover="hover"
                    className="h-full w-full"
                  >
                    <OptimizedImage
                      src={packageItem.image || "/placeholder.svg"}
                      alt={packageItem.name}
                      className="h-full w-full object-contain"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <motion.div
                    className="absolute top-4 left-4"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <div className="border-main flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-sm">
                      <div className="text-main">{getIcon(packageItem.icon)}</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute right-4 bottom-4 left-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      <Clock className="mr-1 h-3 w-3" />
                      {packageItem.session_type}
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900">
                      {packageItem.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                      {packageItem.description}
                    </p>

                    {/* Target Audience */}
                    <div className="flex flex-wrap gap-2">
                      {packageItem.target_audience.map((audience, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
                        >
                          <Users className="mr-1 h-3 w-3" />
                          {audience}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Package Details */}
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">
                      {"What's Included:"}
                    </h4>
                    <ul className="space-y-2">
                      {packageItem.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="text-main mt-0.5 h-4 w-4 flex-shrink-0" />
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Post Session Benefits */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">
                      After Your Session:
                    </h4>
                    <ul className="space-y-2">
                      {packageItem.post_session_benefits.map((benefit, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + idx * 0.1 }}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="text-main mt-0.5 h-4 w-4 flex-shrink-0" />
                          <span>{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}
