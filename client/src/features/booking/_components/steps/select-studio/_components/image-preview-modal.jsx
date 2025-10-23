import { motion, AnimatePresence } from "framer-motion";

export default function ImagePreviewModal({
    previewImages,
    previewIndex,
    setPreviewIndex,
    nextImage,
    prevImage,
}) {
    if (previewIndex === null || previewImages.length === 0) return null;

    return (
        <AnimatePresence>
            {previewIndex !== null && previewImages.length > 0 && (
                <motion.div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[600]"
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
                        className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
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
                        onClick={prevImage}
                        className="absolute flex items-center justify-center w-10 h-10 text-2xl text-white rounded-full cursor-pointer left-10 bg-black/50 hover:bg-black/70"
                    >
                        &lt;
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={nextImage}
                        className="absolute flex items-center justify-center w-10 h-10 text-2xl text-white rounded-full cursor-pointer right-10 bg-black/50 hover:bg-black/70"
                    >
                        &gt;
                    </button>

                    {/* Close button */}
                    <button
                        onClick={() => setPreviewIndex(null)}
                        className="absolute flex items-center justify-center w-10 h-10 text-xl text-white rounded-full cursor-pointer top-5 right-5 bg-black/50 hover:bg-black/70"
                    >
                        ×
                    </button>

                    {/* Image counter */}
                    <div className="absolute px-3 py-1 text-sm text-white transform -translate-x-1/2 rounded-full bottom-5 left-1/2 bg-black/50">
                        {previewIndex + 1} / {previewImages.length}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
