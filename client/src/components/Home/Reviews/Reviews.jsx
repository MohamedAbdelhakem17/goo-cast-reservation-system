import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import StarRating from "../../../hooks/useRate"
import { useQuery } from "@tanstack/react-query"
import { user } from "../../../assets/images/index"
import BASE_URL from "../../../apis/BASE_URL"

export default function Reviews() {
  const [current, setCurrent] = useState(0)

  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetch(BASE_URL + "/reviews")
      return res.json()
    },
  })

  // Reset current index when reviews length changes
  useEffect(() => {
    if (reviewsData?.data?.reviews.length > 0) {
      setCurrent(0)
    }
  }, [reviewsData?.data?.reviews.length])

  const formatDate = (seconds) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(seconds * 1000).toLocaleDateString(undefined, options)
  }

  const handleNext = () => {
    if (reviewsData?.data?.reviews.length <= 1) return
    setCurrent((prev) => (prev + 1) % reviewsData?.data?.reviews.length)
  }

  const handlePrev = () => {
    if (reviewsData?.data?.reviews.length <= 1) return
    setCurrent((prev) => (prev - 1 + reviewsData?.data?.reviews.length) % reviewsData?.data?.reviews.length)
  }

  const paginate = (direction) => {
    if (direction > 0) handleNext()
    else handlePrev()
  }

  // Get displayed reviews based on total count
  const getDisplayedReviews = () => {
    if (reviewsData?.data?.reviews.length === 0) return []
    if (reviewsData?.data?.reviews.length === 1) return [reviewsData?.data?.reviews[0]]
    if (reviewsData?.data?.reviews.length === 2) {
      return [reviewsData?.data?.reviews[current], reviewsData?.data?.reviews[(current + 1) % 2]]
    }

    // For 3 or more reviews, show previous, current, and next
    return [
      reviewsData?.data?.reviews[(current - 1 + reviewsData?.data?.reviews.length) % reviewsData?.data?.reviews.length], // Previous
      reviewsData?.data?.reviews[current], // Current
      reviewsData?.data?.reviews[(current + 1) % reviewsData?.data?.reviews.length], // Next
    ]
  }

  const displayedReviews = getDisplayedReviews()

  // Enhanced animation variants with better responsive behavior
  const reviewVariants = {
    initial: (index) => ({
      opacity: index === 1 ? 0.7 : 0.3,
      scale: index === 1 ? 0.9 : 0.8,
      y: 30,
      x: index === 0 ? -50 : index === 2 ? 50 : 0,
    }),
    animate: (index) => ({
      opacity: reviewsData?.data?.reviews.length <= 2 ? 1 : index === 1 ? 1 : 0.5,
      scale: reviewsData?.data?.reviews.length <= 2 ? 1 : index === 1 ? 1 : 0.85,
      y: 0,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    }),
    exit: (index) => ({
      opacity: 0,
      scale: 0.7,
      y: index === 1 ? -30 : 30,
      x: index === 0 ? -100 : index === 2 ? 100 : 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    }),
    hover: {
      scale: 1.03,
      y: -5,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  }

  // Container animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        className="mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-b from-white to-rose-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-rose-500 mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.p
          className="text-rose-600 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading reviews...
        </motion.p>
      </motion.div>
    )
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className="mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-b from-white to-rose-50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-6 max-w-md text-center">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-rose-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </motion.svg>
          <h3 className="text-lg font-bold text-rose-700 mb-2">Failed to Load Reviews</h3>
          <p className="text-rose-600 mb-4">We couldn't load the reviews at this time. Please try again later.</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // Empty state
  if (reviewsData?.data?.reviews.length === 0) {
    return (
      <motion.div
        className="mx-auto py-12 px-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative elements */}
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-rose-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 bg-rose-200 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Header */}
        <motion.div
          className="flex flex-col items-center mb-12 relative"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.span
            className="text-rose-300 text-sm font-medium tracking-widest uppercase mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Testimonials
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-rose-600 mb-3 tracking-tight text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.div
            className="w-24 h-1.5 bg-gradient-to-r from-rose-300 to-rose-500 rounded-full mb-4"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
        </motion.div>

        <motion.div
          className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-rose-100 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-rose-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </motion.svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600 mb-6">Be the first to share your experience with our studio!</p>
          <motion.button
            className="px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(244, 63, 94, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            Write a Review
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="mx-auto py-8 sm:py-12 px-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-rose-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-40 sm:w-80 h-40 sm:h-80 bg-rose-200 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Header */}
      <motion.div
        className="flex flex-col items-center mb-8 sm:mb-12 relative"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span
          className="text-main text-xs sm:text-sm font-medium tracking-widest uppercase mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Testimonials
        </motion.span>
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-main mb-3 tracking-tight text-center px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          What Our Clients Say
        </motion.h2>
        <motion.div
          className="w-16 sm:w-24 h-1.5 bg-gradient-to-r from-rose-300 to-rose-500 rounded-full mb-4"
          initial={{ width: 0 }}
          animate={{ width: window.innerWidth < 640 ? 64 : 96 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />
        <motion.p
          className="text-gray-600 text-center max-w-lg text-sm md:text-base px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Discover why our clients love working with us and how our studio has helped them create stunning photography.
        </motion.p>
      </motion.div>

      {/* Reviews carousel */}
      <motion.div
        className="flex justify-center items-center w-full py-4 sm:py-8 relative"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 w-full max-w-7xl mx-auto px-2">
          <AnimatePresence mode="popLayout">
            {displayedReviews.map((review, index) => {
              // Enhanced responsive classes
              let containerClasses = ""
              let contentClasses = ""

              if (reviewsData?.data?.reviews.length === 1) {
                containerClasses = "w-full max-w-2xl mx-auto"
                contentClasses = "p-6 sm:p-8"
              } else if (reviewsData?.data?.reviews.length === 2) {
                containerClasses = "w-full max-w-md flex-1"
                contentClasses = "p-4 sm:p-6"
              } else {
                // 3+ reviews - responsive layout
                if (index === 1) {
                  // Center card
                  containerClasses = "w-full sm:w-3/5 md:w-2/5 lg:w-2/5 max-w-lg z-20 mx-2"
                  contentClasses = "p-4 sm:p-6 md:p-8 border-2 border-rose-300"
                } else {
                  // Side cards - hidden on mobile, visible on larger screens
                  containerClasses = "hidden sm:block w-1/5 md:w-1/4 lg:w-1/5 max-w-xs z-10"
                  contentClasses = "p-3 sm:p-4 border border-rose-100"
                }
              }

              return (
                <motion.div
                  key={`${review.author_name}-${index}-${current}`}
                  custom={index}
                  variants={reviewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                  className={`${containerClasses} relative flex flex-col gap-3 sm:gap-5 bg-white rounded-2xl shadow-lg hover:shadow-2xl backdrop-blur-md min-h-[240px] sm:min-h-[280px] flex-shrink-0 overflow-hidden transition-all duration-300 ${contentClasses}`}
                >
                  {/* Quote icon */}
                  <motion.div
                    className="absolute top-1 sm:top-2 left-1 sm:left-2 text-rose-600 text-4xl sm:text-7xl opacity-30"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    "
                  </motion.div>

                  {/* Review content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {index === 1 || reviewsData?.data?.reviews.length <= 2 ? (
                      <p className="text-gray-700 leading-relaxed italic font-medium text-sm sm:text-base relative z-10 pt-6 sm:pt-8 line-clamp-4 sm:line-clamp-none">
                        {review.text}
                      </p>
                    ) : (
                      <p className="text-gray-700 leading-relaxed italic font-medium text-xs sm:text-sm relative z-10 pt-6 sm:pt-8 line-clamp-3">
                        {review.text}
                      </p>
                    )}
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    className="w-12 sm:w-16 h-0.5 bg-rose-200 my-1"
                    initial={{ width: 0 }}
                    animate={{ width: window.innerWidth < 640 ? 48 : 64 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  />

                  {/* Reviewer info */}
                  <motion.div
                    className="flex items-center gap-x-3 sm:gap-x-4 mt-auto"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.img
                      src={user}
                      alt={review.author_name}
                      className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border-2 sm:border-3 border-rose-200 shadow-md bg-white flex-shrink-0"
                      whileHover={{
                        scale: 1.1,
                        borderColor: "#fb7185",
                        boxShadow: "0 8px 25px rgba(244, 63, 94, 0.3)",
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="text-sm sm:text-lg font-bold text-gray-800 group-hover:text-rose-600 transition-colors truncate">
                        {review.author_name}
                      </h3>
                      <div className="mb-1">
                        <StarRating rating={review.rating} />
                      </div>
                      <span className="text-xs text-gray-400 font-medium truncate">
                        {formatDate(new Date(review.time))}
                      </span>
                    </div>
                  </motion.div>

                  {/* Badge for featured review - only show when 3+ reviews */}
                  {reviewsData?.data?.reviews.length >= 3 && index === 1 && (
                    <motion.div
                      className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-rose-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-md"
                      initial={{ scale: 0, opacity: 0, rotate: -180 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 200 }}
                    >
                      Featured
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Only show controls if there are 2+ reviews */}
      {reviewsData?.data?.reviews.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          {/* Controls */}
          <div className="flex justify-center mt-6 sm:mt-10 gap-3 sm:gap-4 md:gap-8 px-4">
            <motion.button
              onClick={() => paginate(-1)}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white border-2 border-rose-200 text-rose-600 font-semibold text-xs sm:text-sm rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50"
              whileHover={{
                backgroundColor: "#fecdd3",
                borderColor: "#fb7185",
                scale: 1.05,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="text-lg sm:text-xl"
                animate={{ x: [0, -4, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 1,
                  repeatDelay: 1,
                }}
              >
                &#8592;
              </motion.span>
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </motion.button>

            <motion.button
              onClick={() => paginate(1)}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-rose-500 border-2 border-rose-500 text-white font-semibold text-xs sm:text-sm rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50"
              whileHover={{
                backgroundColor: "#e11d48",
                scale: 1.05,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <motion.span
                className="text-lg sm:text-xl"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 1,
                  repeatDelay: 1,
                }}
              >
                &#8594;
              </motion.span>
            </motion.button>
          </div>

          {/* Review counter - only if there are multiple reviews */}
          {reviewsData?.data?.reviews.length > 2 && (
            <motion.div
              className="flex justify-center mt-4 sm:mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex items-center gap-1.5">
                {reviewsData?.data?.reviews.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                      index === current ? "w-6 sm:w-8 bg-rose-500" : "w-2 bg-rose-200 hover:bg-rose-300"
                    }`}
                    onClick={() => setCurrent(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
