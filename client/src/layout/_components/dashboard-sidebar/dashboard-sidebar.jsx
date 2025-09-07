import { useState } from "react";
import { Mic, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardSidebar({ children }) {
  // State
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Mobile menu button */}
      <button onClick={() => setIsOpen(true)}
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-main text-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r-1 border-gray-200 h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white  flex items-center justify-between sm:justify-start gap-x-4">
          {/* Icon */}
          <div className="text-white bg-main flex items-center justify-center rounded-xl w-12 h-12 ">
            <Mic className="w-6 h-6" />
          </div>

          {/* Title + Subtitle */}
          <div className="flex flex-col">
            <h1 className="text-main font-semibold text-xl leading-snug">Goocast.</h1>
            <span className="text-sm text-gray-600 tracking-wide">Easy podcasting for everyone</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">{children}</nav>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div className="fixed inset-0 bg-black/10 bg-opacity-50 z-40" onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar */}
            <motion.aside
              className="fixed top-0 left-0 w-64 bg-white flex-col border-r-1 border-gray-200 h-full z-50"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-white  flex items-center justify-between sm:justify-start gap-x-4">
                {/* Icon */}
                <div className="text-white bg-main flex items-center justify-center rounded-xl w-12 h-12">
                  <Mic className="w-6 h-6" />
                </div>

                {/* Title + Subtitle */}
                <div className="flex flex-col">
                  <h1 className="text-main font-semibold text-xl leading-snug">Goocast.</h1>
                  <span className="text-sm text-gray-600 tracking-wide">Easy podcasting for everyone</span>
                </div>

                {/* Close sidebar  */}
                <div className="text-white bg-main flex items-center justify-center rounded-full w-5 h-5 p-3">
                  <button onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>


              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">{children}</nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}