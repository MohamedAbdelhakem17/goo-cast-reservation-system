import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery({ images }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Function to go to the next image
  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) =>
      prevIndex === null || prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  // Function to go to the previous image
  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) =>
      prevIndex === null || prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
      {/* Main Image */}
      <div className="md:col-span-1">
        <motion.img
          src={images[0]}
          initial={{ opacity: 0, y: 30, x: -30 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          alt="Main Preview"
          className="h-full w-full cursor-pointer rounded-lg"
          onClick={() => setSelectedImageIndex(0)}
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 gap-4 md:col-span-2">
        {images.slice(1).map((img, index) => (
          <motion.img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className="h-[250px] w-full cursor-pointer rounded-lg object-cover"
            onClick={() => setSelectedImageIndex(index + 1)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* image preview */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedImageIndex(null)} // Close the image when clicking outside of it
          >
            <motion.img
              src={images[selectedImageIndex]}
              alt="Selected Preview"
              className="max-h-[90%] max-w-[90%] rounded-lg shadow-xl"
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
              className="absolute left-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-2xl text-white hover:bg-black/70"
            >
              &lt;
            </button>

            <button
              onClick={nextImage}
              className="absolute right-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-2xl text-white hover:bg-black/70"
            >
              &gt;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
