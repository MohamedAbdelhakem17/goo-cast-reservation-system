import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function ImagePreviewModal({
  previewImages,
  previewIndex,
  setPreviewIndex,
  nextImage,
  prevImage,
}) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewIndex(null);
      }
    };

    if (previewIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewIndex, setPreviewIndex]);

  if (previewIndex === null || previewImages.length === 0) return null;

  return (
    <AnimatePresence>
      {previewIndex !== null && previewImages.length > 0 && (
        <motion.div
          className="fixed inset-0 z-[600] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setPreviewIndex(null)}
        >
          {/* Image */}
          <motion.img
            src={previewImages[previewIndex]}
            alt="Studio Preview"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-xl"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-2xl text-white hover:bg-black/70"
          >
            &lt;
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-2xl text-white hover:bg-black/70"
          >
            &gt;
          </button>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewIndex(null);
            }}
            className="absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-2xl text-white transition-colors hover:bg-black/70"
            aria-label="Close preview"
          >
            ✕
          </button>

          {/* Image counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 transform rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {previewIndex + 1} / {previewImages.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
