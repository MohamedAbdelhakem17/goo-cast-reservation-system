import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Input, Button, ErrorFeedback } from "@/components/common";
import signinForm from "@/apis/auth/signin.api";

const Signin = ({ closeModal, changeForm }) => {
  const inputRef = useRef(null);
  const { formik, error, isPending } = signinForm(closeModal);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Close Modal */}
      <div className="p-2 my-2 w-full bg-white/80 rounded-t-2xl flex justify-center">
        <motion.i
          onClick={closeModal}
          whileTap={{ scale: 0.9, shadow: "0px 0px 15px rgba(0,0,0,0.3)" }}
          whileHover={{ scale: 1.1 }}
          className="fa-solid fa-circle-xmark text-main text-3xl cursor-pointer"
        />
      </div>

      {/* Form Container */}
      <motion.div
        className="relative overflow-hidden rounded-b-2xl bg-white shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Decorative Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#ed1e26]/20 to-[#ff5b60]/20 dark:from-[#ed1e26]/10 dark:to-[#ff5b60]/10 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#ff5b60]/20 to-[#ff8a8e]/20 dark:from-[#ff5b60]/10 dark:to-[#ff8a8e]/10 blur-3xl opacity-70"></div>

        {/* Form Content */}
        <div className="relative p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your Email and password to access your account.
            </p>
          </motion.div>

          {/* Form */}
          <form className="space-y-2" onSubmit={formik.handleSubmit}>
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Input
                type="email"
                id="email"
                label="Email"
                inputRef={inputRef}
                placeholder="Enter your Email"
                value={formik.values.email}
                errors={formik.errors.email}
                touched={formik.touched.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                isPasswordField={true}
                placeholder="Enter your password"
                value={formik.values.password}
                errors={formik.errors.password}
                touched={formik.touched.password}
                showPasswordToggle={showPassword}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            </motion.div>

            {/* Submit Button */}
            <Button isPending={isPending} className="w-full">
              Sing in
            </Button>

            {/* Server Error */}
            {error && (
              <ErrorFeedback>
                {error.response?.data?.message || error.message}
              </ErrorFeedback>
            )}
          </form>

          {/* Switch to Sign Up */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Don't have an account ?
            <button
              onClick={changeForm}
              className="font-medium text-[#ed1e26] hover:text-[#ff5b60] px-1"
            >
              Sign up now
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Signin;
