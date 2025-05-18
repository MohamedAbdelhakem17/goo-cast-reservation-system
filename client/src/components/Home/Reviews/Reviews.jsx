"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarRating from "../../../hooks/useRate";
import { useQuery } from "@tanstack/react-query";
import { user } from "../../../assets/images/index";
import BASE_URL from "../../../apis/BASE_URL";

// This could come from an API

export default function Reviews() {
    const [current, setCurrent] = useState(0);

    const {
        data: reviewsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            const res = await fetch(BASE_URL + "/reviews");
            return res.json();
        },
    });

    // Reset current index when reviews length changes
    useEffect(() => {
        if (reviewsData?.data?.reviews.length > 0) {
            setCurrent(0);
        }
    }, [reviewsData?.data?.reviews.length]);

    const formatDate = (seconds) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(seconds * 1000).toLocaleDateString(undefined, options);
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

    const paginate = (direction) => {
        if (direction > 0) handleNext();
        else handlePrev();
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
            ], // Previous
            reviewsData?.data?.reviews[current], // Current
            reviewsData?.data?.reviews[
            (current + 1) % reviewsData?.data?.reviews.length
            ], // Next
        ];
    };

    const displayedReviews = getDisplayedReviews();

    // Animation variants
    const reviewVariants = {
        initial: (index) => ({
            opacity: index === 1 ? 0.8 : 0.4,
            scale: index === 1 ? 0.95 : 0.85,
            y: 20,
        }),
        animate: (index) => ({
            opacity:
                reviewsData?.data?.reviews.length <= 2 ? 1 : index === 1 ? 1 : 0.6,
            scale: reviewsData?.data?.reviews.length <= 2 ? 1 : index === 1 ? 1 : 0.9,
            y: 0,
            transition: {
                duration: 0.2,
                ease: "easeOut",
            },
        }),
        exit: () => ({
            opacity: 0,
            scale: 0.8,
            y: -20,
            transition: {
                duration: 0.1,
                ease: "easeIn",
            },
        }),
        hover: {
            scale: 1.02,
            boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: {
                duration: 0.1,
            },
        },
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-b from-white to-rose-50">
                <div className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin mb-4"></div>
                <p className="text-rose-600 font-medium">Loading reviews...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-b from-white to-rose-50">
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-6 max-w-md text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-rose-400 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="text-lg font-bold text-rose-700 mb-2">
                        Failed to Load Reviews
                    </h3>
                    <p className="text-rose-600 mb-4">
                        We couldn't load the reviews at this time. Please try again later.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (reviewsData?.data?.reviews.length === 0) {
        return (
            <div className="mx-auto py-12 px-4 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-200 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                {/* Header */}
                <div className="flex flex-col items-center mb-12 relative">
                    <span className="text-rose-300 text-sm font-medium tracking-widest uppercase mb-2">
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-rose-600 mb-3 tracking-tight">
                        What Our Clients Say
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-rose-300 to-rose-500 rounded-full mb-4"></div>
                </div>

                <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-rose-100 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-rose-300 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        No Reviews Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Be the first to share your experience with our studio!
                    </p>
                    <button className="px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors font-medium">
                        Write a Review
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto py-12 px-4 ">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-200 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-3xl"></div>

            {/* Header */}
            <div className="flex flex-col items-center mb-12 relative">
                <span className="text-rose-300 text-sm font-medium tracking-widest uppercase mb-2">
                    Testimonials
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-rose-600 mb-3 tracking-tight">
                    What Our Clients Say
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-rose-300 to-rose-500 rounded-full mb-4"></div>
                <p className="text-gray-600 text-center max-w-lg text-sm md:text-base">
                    Discover why our clients love working with us and how our studio has
                    helped them create stunning photography.
                </p>
            </div>

            {/* Reviews carousel */}
            <div className="flex justify-center items-center w-full py-8 relative">
                <AnimatePresence mode="popLayout">
                    {displayedReviews.map((review, index) => {
                        // Responsive width for center (60%) and sides (20%)
                        let widthClass = "";
                        if (reviewsData?.data?.reviews.length === 1) {
                            widthClass = "max-w-2xl w-[60vw]";
                        } else if (index === 1) {
                            widthClass = "z-20 bg-white border-2 border-rose-300 w-[60vw] min-w-[320px] max-w-3xl";
                        } else {
                            widthClass = "z-10 bg-white/90 border border-rose-100 w-[20vw] min-w-[180px] max-w-xs";
                        }
                        return (
                            <motion.div
                                key={review.id}
                                custom={index}
                                variants={reviewVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                whileHover="hover"
                                className={`relative flex flex-col gap-5 ${widthClass} transition-all duration-300 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl backdrop-blur-md min-h-[260px] flex-shrink-0 overflow-hidden`}
                            >
                                {/* Quote icon */}
                                <div className="absolute top-2 left-2 text-rose-600 text-7xl opacity-30">
                                    "
                                </div>

                                {/* Review content */}
                                {index === 1 ? (
                                    <p className="text-gray-700  leading-relaxed italic font-medium text-sm md:text-base relative z-10 w-full whitespace-normal break-words h-auto max-h-32 pt-2">
                                        {review.text}
                                    </p>
                                ) : (
                                    <p className="text-gray-700  leading-relaxed italic font-medium text-sm md:text-base relative z-10 mb-2 truncate whitespace-nowrap overflow-ellipsis w-full h-12 pt-2">
                                        {review.text}
                                    </p>
                                )}

                                {/* Divider */}
                                <div className="w-16 h-0.5 bg-rose-200 my-1"></div>

                                {/* Reviewer info */}
                                <div className="flex items-center gap-x-4">
                                    <motion.img
                                        src={user}
                                        alt={review.author_name}
                                        className="h-16 w-16 rounded-full object-cover border-3 border-rose-200 shadow-md bg-white"
                                        whileHover={{ scale: 1.1, borderColor: "#fb7185" }}
                                        transition={{ duration: 0.2 }}
                                    />
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-rose-600 transition-colors truncate w-32 md:w-40">
                                            {review.author_name}
                                        </h3>
                                        <div className="mb-1">
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium truncate w-24">
                                            {formatDate(new Date(review.time))}
                                        </span>
                                    </div>
                                </div>

                                {/* Badge for featured review - only show when 3+ reviews */}
                                {reviewsData?.data?.reviews.length >= 3 && index === 1 && (
                                    <motion.div
                                        className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.3 }}
                                    >
                                        Featured
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Only show controls if there are 2+ reviews */}
            {reviewsData?.data?.reviews.length > 2 && (
                <>
                    {/* Controls */}
                    <div className="flex justify-center mt-10 gap-4 md:gap-8">
                        <motion.button
                            onClick={() => paginate(-1)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-rose-200 text-rose-600 font-semibold text-sm rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50"
                            whileHover={{
                                backgroundColor: "#fecdd3",
                                borderColor: "#fb7185",
                                scale: 1.05,
                                boxShadow:
                                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.span
                                className="text-xl"
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
                            <span>Previous</span>
                        </motion.button>

                        <motion.button
                            onClick={() => paginate(1)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 border-2 border-rose-500 text-white font-semibold text-sm rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50"
                            whileHover={{
                                backgroundColor: "#e11d48",
                                scale: 1.05,
                                boxShadow:
                                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Next</span>
                            <motion.span
                                className="text-xl"
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
                    <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-1.5">
                            {reviewsData?.data?.reviews.map((_, index) => (
                                <motion.div
                                    key={index}
                                    className={`h-2 rounded-full cursor-pointer ${index === current ? "w-6 bg-rose-500" : "w-2 bg-rose-200"
                                        }`}
                                    onClick={() => setCurrent(index)}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
