import signupForm from "@/apis/auth/signup.api";
import { Input } from "@/components/common";
import { motion } from "framer-motion";
import { useRef } from "react";
// import GoogleButton from "@/components/Google-Button/GoogleButton"
import useLocalization from "@/context/localization-provider/localization-context";

export default function Signup({ closeModal, changeForm }) {
  const { t } = useLocalization();
  const { formik, serverError, successMessage } = signupForm(closeModal);
  const inputRef = useRef(null);

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Close Modal */}
      <div className="my-2 flex w-full justify-center rounded-t-3xl bg-white/80 p-2 transition-none dark:bg-gray-800/80">
        <motion.i
          onClick={closeModal}
          whileTap={{ scale: 0.9, shadow: "0px 0px 15px rgba(0,0,0,0.3)" }}
          whileHover={{ scale: 1.1 }}
          className="fa-solid fa-circle-xmark text-main cursor-pointer text-3xl"
        />
      </div>

      {/* Card */}
      <motion.div
        className="relative overflow-hidden rounded-b-3xl bg-white shadow-xl transition-none dark:bg-gray-800"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Decorative Background */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-[#ed1e26]/20 to-[#ff5b60]/20 opacity-70 blur-3xl dark:from-[#ed1e26]/10 dark:to-[#ff5b60]/10"></div>
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-gradient-to-br from-[#ff5b60]/20 to-[#ff8a8e]/20 opacity-70 blur-3xl dark:from-[#ff5b60]/10 dark:to-[#ff8a8e]/10"></div>

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-6 text-center"
          >
            <h2 className="mb-2 text-2xl font-bold text-gray-800 transition-none dark:text-gray-100">
              {t("welcome-join-us")}
            </h2>
            <p className="text-sm text-gray-600 transition-none dark:text-gray-400">
              {t("create-your-account-and-start-your-journey")}
            </p>
          </motion.div>

          {/* Form */}
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Input
                type="text"
                id="name"
                label={t("full-name")}
                inputRef={inputRef}
                placeholder={t("enter-your-name")}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors.name}
                touched={formik.touched.name}
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
                label={t("email")}
                placeholder={t("enter-your-email")}
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
                label={t("password")}
                isPasswordField
                inputRef={inputRef}
                placeholder={t("enter-your-password")}
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
                label={t("confirm-password")}
                inputRef={inputRef}
                placeholder={t("re-enter-your-password")}
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
              className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#ed1e26] to-[#ff5b60] px-4 py-3 font-medium text-white shadow-md transition-all duration-200 hover:from-[#d91c23] hover:to-[#e64b50] hover:shadow-lg focus:ring-2 focus:ring-[#ed1e26] focus:ring-offset-2 focus:outline-none"
            >
              {t("sign-up-0")}
            </motion.button>

            {/* Server Error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="mt-1 flex items-center space-x-1 text-sm text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{serverError}</span>
              </motion.div>
            )}

            {/* Success Message */}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="mt-1 flex items-center space-x-1 text-sm text-green-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.293-11.293a1 1 0 00-1.414 0L9 10.586l-1.879-1.879a1 1 0 00-1.414 1.414l2.293 2.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{successMessage}</span>
              </motion.div>
            )}
            {/* 
            <hr className="border-gray-300 my-4"/>
            <GoogleButton label="Sign up with Google" /> */}
          </form>

          {/* Switch to Sign In */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            {t("already-have-an-account")}
            <button
              onClick={changeForm}
              className="font-medium text-[#ed1e26] hover:text-[#ff5b60]"
            >
              {t("sign-in-now")}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
