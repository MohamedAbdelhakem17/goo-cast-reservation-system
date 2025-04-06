import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { studio  , studio2} from "../../../assets/images";

const images = [
    // Replace with actual image URLs
    studio,
    studio2,
    studio,
    studio,
    studio2,
];

export default function Gallery() {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    // Function to go to the next image
    const nextImage = (e) => {
        e.stopPropagation(); // Prevent closing the image
        setSelectedImageIndex((prevIndex) =>
            prevIndex === null || prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Function to go to the previous image
    const prevImage = (e) => {
        e.stopPropagation(); // Prevent closing the image
        setSelectedImageIndex((prevIndex) =>
            prevIndex === null || prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
                <motion.img
                    src={images[0]}
                    initial={{ opacity: 0, y: 30, x: -30 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    alt="Main Preview"
                    className="w-full h-full rounded-lg cursor-pointer"
                    onClick={() => setSelectedImageIndex(0)}
                />
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {images.slice(1).map((img, index) => (
                    <motion.img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-[250px] object-cover rounded-lg cursor-pointer"
                        onClick={() => setSelectedImageIndex(index + 1)}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: "easeOut",
                        }}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedImageIndex(null)} // Close image when clicking outside
                    >
                        <motion.img
                            src={images[selectedImageIndex]}
                            alt="Selected Preview"
                            className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing the image when clicking on the image
                        />

                        {/* Prev and Next Buttons */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 text-white text-3xl p-2 rounded-full bg-black/50 hover:bg-black/70"
                        >
                            &lt;
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 text-white text-3xl p-2 rounded-full bg-black/50 hover:bg-black/70"
                        >
                            &gt;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
