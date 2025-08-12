import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "@/components/Home/Hero/Hero";
import Studio from "@/components/Home/Studio/Studio";
import PackagesSection from "@/components/Home/Packages-Section/PackagesSection";
import Reviews from "@/components/Home/Reviews/Reviews";
import BookNow from "@/components/Home/Book-Now/BookNow";

const Home = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const isActivated = localStorage.getItem("emailActivated");
    if (isActivated === "true") {
      setShowMessage(true);
      localStorage.removeItem("emailActivated");
      setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    }
  }, []);

  return (
    <main className="container mx-auto py-5 my-5">
      <Hero />
      <PackagesSection />
      <BookNow />
      <Studio />
      <Reviews />

      <AnimatePresence>
        {showMessage && (
          <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium tracking-wide">
                Email has been successfully verified!
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Home;
