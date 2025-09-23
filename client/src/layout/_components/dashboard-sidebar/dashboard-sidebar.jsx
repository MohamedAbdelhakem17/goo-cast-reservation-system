import { useState } from "react";
import { Mic, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logo } from "@/assets/images";
import { OptimizedImage } from "@/components/common";

export default function DashboardSidebar({ children }) {
  // State
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed Mobile Navbar */}
      <div className="fixed top-0 right-0 left-0 z-40 border-b border-gray-200 bg-white shadow-md md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <OptimizedImage src={logo} alt="goocast" className="w-36 object-fill" />
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="bg-main flex items-center justify-center rounded-lg p-2 text-white shadow-sm transition-shadow hover:shadow-md"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden h-full w-72 flex-col border-r border-gray-200 bg-white md:fixed md:start-0 md:top-0 md:bottom-0 md:flex">
        {/* Header */}
        <div className="flex items-center gap-x-3 border-b border-gray-200 bg-white p-4 lg:gap-x-4 lg:p-6">
          {/* Icon */}
          <div className="bg-main flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm lg:h-12 lg:w-12">
            <Mic className="h-5 w-5 lg:h-6 lg:w-6" />
          </div>

          {/* Title + Subtitle */}
          <div className="flex min-w-0 flex-col">
            <h1 className="text-main truncate text-lg font-semibold lg:text-xl">
              Goocast.
            </h1>
            <span className="text-xs text-gray-600 lg:text-sm">
              Easy podcasting for everyone
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 lg:p-4">
          <div className="space-y-1">{children}</div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/30 md:hidden"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Sidebar */}
            <aside className="fixed top-0 bottom-0 left-0 z-50 max-h-screen w-80 max-w-[85vw] flex-col bg-white shadow-2xl md:hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
                {/* Icon */}
                <div className="bg-main flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm">
                  <Mic className="h-5 w-5" />
                </div>

                {/* Title + Subtitle */}
                <div className="mx-3 flex min-w-0 flex-1 flex-col">
                  <h1 className="text-main truncate text-lg font-semibold">Goocast.</h1>
                  <span className="truncate text-xs text-gray-600">
                    Easy podcasting for everyone
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">{children}</nav>
            </aside>
          </>
        )}
      </AnimatePresence>
      <div className="w-full pt-12 md:hidden" />
    </>
  );
}
