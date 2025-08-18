import React from 'react';
import {  GetPackagesByCategory } from '../../../apis/services/services.api';
import { useEffect } from 'react';
import { Check, Video, Mic, Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'


export default function PackagesSection() {
  const { mutate: getPackages, data: packages } = GetPackagesByCategory();


  useEffect(() => {
    getPackages({ category: "681c913473e625151f4f075d" });
  }, [getPackages]);


  const getIcon = (iconType) => {
    switch (iconType) {
      case 'video':
        return <Video className="w-6 h-6" />
      case 'microphone':
        return <Mic className="w-6 h-6" />
      default:
        return <Video className="w-6 h-6" />
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const iconVariants = {
    hover: {
      rotate: 360,
      scale: 1.1,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-12 relative text-center">
        <span className="text-main text-sm font-medium tracking-widest uppercase mb-2">
          Packages
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-main mb-3 tracking-tight">
          Our Packages
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-rose-300 to-rose-500 rounded-full mb-4"></div>
        <p className="text-gray-600 max-w-lg text-sm md:text-base">
          Choose from a variety of packages tailored to fit your creative needs and budget.
        </p>
      </div>

      {packages?.data?.length === 0 ? (
        <p className="text-center text-gray-500">No packages available at the moment.</p>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
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
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {/* Header with Image */}
                <div className="relative h-64 overflow-hidden">
                  <motion.div
                    variants={imageVariants}
                    whileHover="hover"
                    className="w-full h-full"
                  >
                    <img
                      src={packageItem.image || "/placeholder.svg"}
                      alt={packageItem.name}
                      
                      className="object-contain w-full h-full"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <motion.div
                    className="absolute top-4 left-4"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-main/60 backdrop-blur-sm border border-white/30">
                      <div className="text-black">
                        {getIcon(packageItem.icon)}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-4 left-4 right-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
                      <Clock className="w-3 h-3 mr-1" />
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {packageItem.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
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
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"
                        >
                          <Users className="w-3 h-3 mr-1" />
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
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">{"What's Included:"}</h4>
                    <ul className="space-y-2">
                      {packageItem.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
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
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">After Your Session:</h4>
                    <ul className="space-y-2">
                      {packageItem.post_session_benefits.map((benefit, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + idx * 0.1 }}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
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
