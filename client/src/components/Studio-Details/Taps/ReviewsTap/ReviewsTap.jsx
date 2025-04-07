import React from 'react'
import { motion } from "framer-motion"
import { user } from '../../../../assets/images'

export default function ReviewsTap() {
    // Sample review data
    const reviews = [
        {
            id: 1,
            name: "Emma Thompson",
            image: user,
            date: "2023-11-15T14:30:00",
            rating: 5,
            comment:
                "Absolutely loved this studio! The lighting was perfect for my portrait session, and the staff was incredibly helpful with setup.",
        },
        {
            id: 2,
            name: "Michael Chen",
            image: user,
            date: "2023-11-10T09:15:00",
            rating: 4.5,
            comment:
                "Great space with excellent equipment. The only minor issue was parking availability, but the studio itself exceeded my expectations.",
        },
        {
            id: 3,
            name: "Sarah Johnson",
            image: user,
            date: "2023-11-05T16:45:00",
            rating: 4,
            comment:
                "I've used many studios in the city, and this one ranks among the top. Clean, spacious, and well-maintained. Will definitely book again.",
        },
    ]

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <motion.span
                    key={`star-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                >
                    <i className="fa-solid fa-star w-5 h-5 fill-amber-400 text-amber-400"></i>
                </motion.span>,
            )
        }

        if (hasHalfStar) {
            stars.push(
                <motion.span
                    key="half-star"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * fullStars }}
                >
                    <i class="fa-solid fa-star-half w-5 h-5 fill-amber-400 text-amber-400"></i>
                </motion.span>,
            )
        }

        return stars
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    }

    const reviewVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 100,
            },
        },
    }


    return (
        <div className="max-w-3xl mx-auto md:px-6 py-8 bg-white rounded-xl ">
            <motion.div className="max-w-4xl mx-auto md:px-4" initial="hidden" animate="visible" variants={containerVariants}>
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden md:p-6 p-2 border border-gray-100"
                            variants={reviewVariants}
                            whileHover={{
                                y: -5,
                                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
                                transition: { duration: 0.2 },
                            }}
                        >
                            <div className="flex items-start ">
                                <motion.div className="flex-shrink-0 mr-4" whileHover={{ scale: 1.1 }}>
                                    <img
                                        src={review.image || "/placeholder.svg"}
                                        alt={review.name}
                                        className="h-14 w-14 rounded-full object-cover border-2 border-rose-100"
                                    />
                                </motion.div>

                                <div className="flex-1">
                                    <div className="flex justify-between md:items-center mb-1 flex-col md:flex-row">
                                        <motion.h3 className="text-lg font-semibold text-gray-800" whileHover={{ color: "#f43f5e" }}>
                                            {review.name}
                                        </motion.h3>
                                        <motion.span
                                            className="text-sm text-gray-500"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            {formatDate(review.date)}
                                        </motion.span>
                                    </div>

                                    <motion.div
                                        className="flex mb-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {renderStars(review.rating)}
                                    </motion.div>

                                    <motion.p
                                        className="text-gray-600 leading-relaxed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {review.comment}
                                    </motion.p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

