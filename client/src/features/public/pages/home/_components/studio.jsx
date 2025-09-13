import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StarRating from "@/hooks/useRate";
import useGetAllStudios from "@/apis/studios/studios.api";
// import usePriceFormat from "../../../hooks/usePriceFormat";
import { ImageLoader } from "@/components/common";
export default function Studio() {
  // const priceFormat = usePriceFormat()
  // Animation variants for staggered animations
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

  // const headerVariants = {
  //     hidden: { x: -20, opacity: 0 },
  //     visible: {
  //         x: 0,
  //         opacity: 1,
  //         transition: {
  //             type: "spring",
  //             stiffness: 100,
  //             duration: 0.6,
  //         },
  //     },
  // };

  // const linkVariants = {
  //     hidden: { x: 20, opacity: 0 },
  //     visible: {
  //         x: 0,
  //         opacity: 1,
  //         transition: {
  //             type: "spring",
  //             stiffness: 100,
  //             duration: 0.6,
  //             delay: 0.2,
  //         },
  //     },
  // };

  // Sample studio data
  const { data: studiosData, isLoading } = useGetAllStudios();

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: custom * 0.2,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="my-8 py-8">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-8">
                <motion.h2
                    className="text-4xl font-semibold font-sub text-main"
                    initial="hidden"
                    animate="visible"
                    variants={headerVariants}
                >
                    Setups
                </motion.h2>

                <motion.div initial="hidden" animate="visible" variants={linkVariants}>
                    <Link
                        to="/setups"
                        className="flex items-center gap-2 text-gray-700 hover:text-main transition-all duration-300 group"
                    >
                        <span className="font-bold">See all</span>
                        <i className="fa-solid fa-play text-main text-[10px] transition-all duration-300"></i>
                    </Link>
                </motion.div>
            </div> */}

      <div className="relative mb-12 flex flex-col items-center">
        <span className="text-main mb-2 text-sm font-medium tracking-widest uppercase">
          Setups
        </span>
        <h2 className="text-main mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          Our Setups
        </h2>
        <div className="mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-rose-300 to-rose-500"></div>
        <p className="max-w-lg text-center text-sm text-gray-600 md:text-base">
          Explore our beautifully designed setups equipped with the latest gear to make
          your shoot perfect.
        </p>
      </div>

      {/* Studios  */}
      <motion.div
        className="flex flex-wrap items-stretch justify-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
              <ImageLoader
                src={studio.thumbnail || "/placeholder.svg"}
                alt={studio.name}
                className="h-full w-full object-cover"
              />

              <motion.div
                className="from-main/30 absolute inset-0 flex items-end bg-gradient-to-t to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="px-8 py-4 text-white">
                  <Link to={`/setups/${studio.slug}`} className="font-bold">
                    View Details
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Studio Name and Location */}
            <div className="flex flex-grow flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">{studio.name}</h3>
                </div>

                <p className="mt-2 flex items-center gap-2 text-gray-600">
                  <i className="fa-solid fa-location-dot text-main"></i>
                  <span className="text-lg">{studio.address}</span>
                </p>
              </div>

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
