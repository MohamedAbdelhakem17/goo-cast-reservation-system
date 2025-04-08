import React from "react";
import { motion } from "framer-motion";

// Animation variants for the star rating
const starVariants = {
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

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;

    const renderStarIcon = (index) => {
        if (index < fullStars) {
            return "fa-solid fa-star";
        } else if (index === fullStars && hasHalfStar) {
            return "fa-solid fa-star-half-stroke";
        }
        return "fa-regular fa-star"
    };

    return (
        <div className="flex py-2">
            {Array.from({ length: 5 }).map((_, index) => (
                <motion.i
                    key={index}
                    className={`${renderStarIcon(index)} text-amber-400 w-5 h-5`}
                    variants={starVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                />
            ))}
        </div>
    );
};

export default StarRating;
