import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { studio, studio2 } from "../../assets/images"
import { useEffect, useState } from "react"

export default function Studios() {
  // Sample studio data - using exactly what was provided
  const studios = [
    { id: 1, name: "Sunrise Studio", location: "Los Angeles", image: studio },
    { id: 2, name: "Moonlight Records", location: "New York", image: studio2 },
    { id: 3, name: "Echo Chamber", location: "Nashville", image: studio },
    { id: 4, name: "Harmony House", location: "Austin", image: studio2 },
    { id: 5, name: "Rhythm Works", location: "Chicago", image: studio },
    { id: 6, name: "Sound Haven", location: "Miami", image: studio2 },
  ]

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
  }

  const StarRating = () => {
    return (
      <div className="flex py-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.i
            key={index}
            className="fa-solid fa-star text-yellow-400"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={index}
          />
        ))}
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }


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
    <section className="py-10 px-4 ">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center mb-10 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Find Your Perfect Studio
        </motion.h2>

        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {studios.map((studio) => (
            <motion.div
              key={studio.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
              initial={{ opacity: 0, y: 50, scale: 0.7, rotate: scrollDir === "down" ? 4 : -4 }}
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
                <div className="relative md:w-1/3 h-64 md:h-auto overflow-hidden">
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.3 },
                    }}
                    className="h-full"
                  >
                    <img
                      src={studio.image || "/placeholder.svg"}
                      alt={studio.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end md:opacity-0 md:hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="p-4 text-white">
                      <Link to={`/studio/${studio.id}`} className="text-xl font-semibold flex items-center gap-2">
                        <span>View Details</span>
                      </Link>
                    </div>
                  </motion.div>
                </div>

                {/* Studio Details */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">{studio.name}</h3>
                      <p className="text-gray-600 flex items-center gap-2 mb-3">
                        <i className="fa-solid fa-location-dot text-rose-500"></i>
                        <span>{studio.location}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <StarRating />
                      <span className="text-sm text-gray-500">5.0 (24 reviews)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-music text-gray-400"></i>
                      <span className="text-gray-600">Professional Equipment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-clock text-gray-400"></i>
                      <span className="text-gray-600">24/7 Availability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-user-group text-gray-400"></i>
                      <span className="text-gray-600">Engineer Included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-wifi text-gray-400"></i>
                      <span className="text-gray-600">Free Wi-Fi</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <p className="text-rose-500 font-bold text-2xl mb-4 sm:mb-0">100 $ per hour</p>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i className="fa-solid fa-bookmark mr-2"></i>
                        Save
                      </button>
                      <Link
                        to={`/studio/${studio.id}`}
                        className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>

                  <motion.div
                    className="mt-4 h-1 bg-main rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

