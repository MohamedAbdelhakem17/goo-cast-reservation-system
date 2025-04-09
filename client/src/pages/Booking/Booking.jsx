"use client"

import { useState } from "react"
import { useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function Booking() {
  const location = useLocation()
  const { step = 1, selectedStudio = null } = location.state || {}

  const [currentStep, setCurrentStep] = useState(step)
  const [studio, setStudio] = useState(selectedStudio)

  const totalSteps = 4

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { when: "afterChildren" },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: { y: -20, opacity: 0 },
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const selectStudio = () => {
    setStudio({ name: "Studio 1", image: "studio1.jpg", price: 100, description: "Lorem ipsum dolor sit amet." })
    handleNextStep()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Step indicator */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            {[...Array(totalSteps)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${index + 1 === currentStep
                      ? "bg-blue-500 text-white"
                      : index + 1 < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    } font-semibold text-lg`}
                  initial={false}
                  animate={
                    index + 1 === currentStep
                      ? { scale: [1, 1.2, 1], backgroundColor: "#3B82F6" }
                      : index + 1 < currentStep
                        ? { backgroundColor: "#10B981" }
                        : { backgroundColor: "#E5E7EB" }
                  }
                  transition={{ duration: 0.3 }}
                >
                  {index + 1 < currentStep ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </motion.div>
                <span className="text-xs mt-2 font-medium text-gray-500">Step {index + 1}</span>
              </div>
            ))}
          </div>

          <div className="relative mt-2">
            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200 rounded"></div>
            <motion.div
              className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-blue-500 rounded"
              initial={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait" custom={currentStep}>
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="px-6 py-8"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <motion.h1 variants={itemVariants} className="text-3xl font-bold text-center text-gray-800">
                {currentStep === 1 && "Choose Your Studio"}
                {currentStep === 2 && "Select Date & Time"}
                {currentStep === 3 && "Your Information"}
                {currentStep === 4 && "Booking Confirmation"}
              </motion.h1>

              <motion.div variants={itemVariants} className="text-center text-gray-600">
                <p className="text-lg">
                  Step {currentStep} of {totalSteps}
                </p>
                {studio && <p className="mt-2 font-medium">Selected Studio: {studio.name}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-gray-700">Please select a studio to continue with your booking.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        onClick={selectStudio}
                      >
                        <div className="h-40 bg-gray-200 rounded-md mb-3"></div>
                        <h3 className="font-bold text-lg">Studio 1</h3>
                        <p className="text-blue-500 font-medium">$100 / hour</p>
                        <p className="text-gray-600 text-sm mt-2">
                          Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                      </motion.div>
                      <motion.div
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        onClick={selectStudio}
                      >
                        <div className="h-40 bg-gray-200 rounded-md mb-3"></div>
                        <h3 className="font-bold text-lg">Studio 2</h3>
                        <p className="text-blue-500 font-medium">$120 / hour</p>
                        <p className="text-gray-600 text-sm mt-2">
                          Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-gray-700">Select your preferred date and time for the booking.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input type="time" className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-gray-700">Please provide your contact information.</p>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                    >
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800">Booking Confirmed!</h3>
                    <p className="text-gray-600">
                      Thank you for your booking. We've sent a confirmation email with all the details.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-4">
                      <p className="text-blue-800 font-medium">Booking Reference: #BK12345</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md ${currentStep === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            onClick={handlePrevStep}
            disabled={currentStep === 1}
          >
            Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md ${currentStep === totalSteps
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            onClick={currentStep === totalSteps ? () => alert("Booking completed!") : handleNextStep}
          >
            {currentStep === totalSteps ? "Complete Booking" : "Next Step"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
