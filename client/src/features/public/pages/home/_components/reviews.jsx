import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import StarRating from "@/hooks/useRate";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants/config";

export default function Reviews() {
  const [current, setCurrent] = useState(0);

  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetch(API_BASE_URL + "/reviews");
      return res.json();
    },
  });

  // Reset current index when reviews length changes
  useEffect(() => {
    if (reviewsData?.data?.reviews.length > 0) {
      setCurrent(0);
    }
  }, [reviewsData?.data?.reviews.length]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleNext = () => {
    if (reviewsData?.data?.reviews.length <= 1) return;
    setCurrent((prev) => (prev + 1) % reviewsData?.data?.reviews.length);
  };

  const handlePrev = () => {
    if (reviewsData?.data?.reviews.length <= 1) return;
    setCurrent(
      (prev) =>
        (prev - 1 + reviewsData?.data?.reviews.length) %
        reviewsData?.data?.reviews.length
    );
  };

  // Get displayed reviews based on total count
  const getDisplayedReviews = () => {
    if (reviewsData?.data?.reviews.length === 0) return [];
    if (reviewsData?.data?.reviews.length === 1)
      return [reviewsData?.data?.reviews[0]];
    if (reviewsData?.data?.reviews.length === 2) {
      return [
        reviewsData?.data?.reviews[current],
        reviewsData?.data?.reviews[(current + 1) % 2],
      ];
    }
    // For 3 or more reviews, show previous, current, and next
    return [
      reviewsData?.data?.reviews[
        (current - 1 + reviewsData?.data?.reviews.length) %
          reviewsData?.data?.reviews.length
      ],
      reviewsData?.data?.reviews[current],
      reviewsData?.data?.reviews[
        (current + 1) % reviewsData?.data?.reviews.length
      ],
    ];
  };

  const displayedReviews = getDisplayedReviews();

  // Subtle animation variants
  const reviewVariants = {
    initial: (index) => ({
      opacity: index === 1 ? 0.8 : 0.4,
      scale: index === 1 ? 0.95 : 0.9,
      y: 10,
    }),
    animate: (index) => ({
      opacity:
        reviewsData?.data?.reviews.length <= 2 ? 1 : index === 1 ? 1 : 0.6,
      scale: reviewsData?.data?.reviews.length <= 2 ? 1 : index === 1 ? 1 : 0.9,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    exit: () => ({
      opacity: 0,
      scale: 0.9,
      y: 10,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    }),
  };

  // Container animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        className="mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-8 h-8 rounded-full border-2 border-rose-200 border-t-rose-500 mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-rose-600 font-medium">Loading reviews...</p>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className="mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-6 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-rose-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-rose-700 mb-2">
            Failed to Load Reviews
          </h3>
          <p className="text-rose-600 mb-4">
            We couldn't load the reviews at this time. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  // Empty state
  if (reviewsData?.data?.reviews.length === 0) {
    return (
      <motion.div
        className="mx-auto py-12 px-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col items-center mb-12 relative"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.span
            className="text-rose-500 text-sm font-medium tracking-wide uppercase mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Testimonials
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-rose-600 mb-3 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-rose-500 rounded-full mb-4"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </motion.div>

        <motion.div
          className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-rose-100 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MessageCircle className="h-16 w-16 text-rose-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Be the first to share your experience with our studio!
          </p>
          <button className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium">
            Write a Review
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mx-auto py-8 sm:py-12 px-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col items-center mb-8 sm:mb-12 relative"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span
          className="text-rose-500 text-sm font-medium tracking-wide uppercase mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Testimonials
        </motion.span>
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-600 mb-3 text-center px-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          What Our Clients Say
        </motion.h2>
        <motion.div
          className="w-16 sm:w-24 h-1 bg-rose-500 rounded-full mb-4"
          initial={{ width: 0 }}
          animate={{
            width:
              typeof window !== "undefined" && window.innerWidth < 640
                ? 64
                : 96,
          }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        <motion.p
          className="text-gray-600 text-center max-w-lg text-sm md:text-base px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Discover why our clients love working with us and how our studio has
          helped them create stunning photography.
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
          <AnimatePresence>
            {displayedReviews?.map((review, index) => {
              let containerClasses = "";
              let contentClasses = "";

              if (reviewsData?.data?.reviews.length === 1) {
                containerClasses = "w-full max-w-2xl mx-auto";
                contentClasses = "p-6 sm:p-8";
              } else if (reviewsData?.data?.reviews.length === 2) {
                containerClasses = "w-full max-w-md flex-1";
                contentClasses = "p-4 sm:p-6";
              } else {
                if (index === 1) {
                  containerClasses =
                    "w-full sm:w-3/5 md:w-2/5 lg:w-2/5 max-w-lg z-20 mx-2";
                  contentClasses = "p-4 sm:p-6 md:p-8 border-2 border-rose-200";
                } else {
                  containerClasses =
                    "hidden sm:block w-1/5 md:w-1/4 lg:w-1/5 max-w-xs z-10";
                  contentClasses = "p-3 sm:p-4 border border-rose-100";
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
                  className={`${containerClasses} relative flex flex-col gap-3 sm:gap-5 bg-white rounded-xl shadow-md hover:shadow-lg min-h-[240px] sm:min-h-[280px] flex-shrink-0 overflow-hidden transition-shadow duration-200 ${contentClasses}`}
                >
                  {/* Quote icon */}
                  <div className="absolute top-2 left-2 text-rose-500 text-4xl sm:text-6xl opacity-20 font-serif">
                    "
                  </div>

                  {/* Review content */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
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
                  <div className="w-12 sm:w-16 h-0.5 bg-rose-200 my-1" />

                  {/* Reviewer info */}
                  <motion.div
                    className="flex items-center gap-x-3 sm:gap-x-4 mt-auto"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <img
                      src={review.profile_photo_url || "/placeholder.svg"}
                      alt={review.author_name}
                      className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-rose-200 shadow-sm bg-white flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="text-sm sm:text-lg font-bold text-gray-800 truncate">
                        {review.author_name}
                      </h3>
                      <div className="mb-1">
                        <StarRating rating={review.rating} />
                      </div>
                      <span className="text-xs text-gray-400 font-medium truncate">
                        {formatDate(new Date(review.time * 1000).toISOString())}
                      </span>
                    </div>
                  </motion.div>

                  {/* Badge for featured review */}
                  {reviewsData?.data?.reviews.length >= 3 && index === 1 && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-rose-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-sm">
                      Featured
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Controls - only show if there are 2+ reviews */}
      {reviewsData?.data?.reviews.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Navigation buttons */}
          <div className="flex justify-center mt-6 sm:mt-10 gap-3 sm:gap-4 px-4">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white border border-rose-200 text-rose-600 font-medium text-sm rounded-lg shadow-sm hover:bg-rose-50 hover:border-rose-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-rose-500 border border-rose-500 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-rose-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots indicator - only if there are multiple reviews */}
          {reviewsData?.data?.reviews.length > 2 && (
            <motion.div
              className="flex justify-center mt-4 sm:mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                {reviewsData?.data?.reviews.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full cursor-pointer transition-all duration-200 ${
                      index === current
                        ? "w-6 sm:w-8 bg-rose-500"
                        : "w-2 bg-rose-200 hover:bg-rose-300"
                    }`}
                    onClick={() => setCurrent(index)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
