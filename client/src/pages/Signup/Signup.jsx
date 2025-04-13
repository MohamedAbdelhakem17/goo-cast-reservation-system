import React, { useRef } from "react"
import { motion } from "framer-motion"
import Input from "../../components/shared/Input/Input"
import signupForm from "../../apis/studios/auth/signup.api"

export default function Signup({ closeModal, changeForm }) {
  const formik = signupForm()
  const inputRef = useRef(null)

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Close Modal */}
      <div className="p-2 my-2 w-full bg-white/80 rounded-t-3xl flex justify-center">
        <motion.i
          onClick={closeModal}
          whileTap={{ scale: 0.9, shadow: "0px 0px 15px rgba(0,0,0,0.3)" }}
          whileHover={{ scale: 1.1 }}
          className="fa-solid fa-circle-xmark text-main text-3xl cursor-pointer"
        />
      </div>

      {/* Card */}
      <motion.div
        className="relative overflow-hidden rounded-b-3xl bg-white shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Decorative Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#ed1e26]/20 to-[#ff5b60]/20 dark:from-[#ed1e26]/10 dark:to-[#ff5b60]/10 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#ff5b60]/20 to-[#ff8a8e]/20 dark:from-[#ff5b60]/10 dark:to-[#ff8a8e]/10 blur-3xl opacity-70"></div>

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, join us</h2>
            <p className="text-gray-600 text-sm">Create your account and start your journey.</p>
          </motion.div>

          {/* Form */}
          <form className="space-y-2" onSubmit={formik.handleSubmit}>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Input
                type="text"
                id="userName"
                label="Full Name"
                inputRef={inputRef}
                placeholder="Enter your name"
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors.userName}
                touched={formik.touched.userName}
              />
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <Input
                type="email"
                id="email"
                label="Email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors.email}
                touched={formik.touched.email}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Input
                type="password"
                id="password"
                label="Password"
                isPasswordField
                inputRef={inputRef}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors.password}
                touched={formik.touched.password}
              />
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.4 }}
            >
              <Input
                type="password"
                id="confirmPassword"
                label="Confirm Password"
                inputRef={inputRef}
                placeholder="Re-enter your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors.confirmPassword}
                touched={formik.touched.confirmPassword}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.4,
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-[#ed1e26] to-[#ff5b60] hover:from-[#d91c23] hover:to-[#e64b50] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ed1e26] focus:ring-offset-2"
            >
              Sign Up
            </motion.button>
          </form>

          {/* Switch to Sign In */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Already have an account?{" "}
            <button
              onClick={changeForm}
              className="font-medium text-[#ed1e26] hover:text-[#ff5b60]"
            >
              Sign in now
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
