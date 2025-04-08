import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Input from "../../components/shared/Input/Input"


const Signin = ({ closeModal, changeForm }) => {
  const inputRef = useRef(null)
  const [formValues, setFormValues] = useState({
    userName: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="p-2  my-2  w-full bg-white/80 rounded-t-2xl flex justify-center"
      >
        <motion.i
          onClick={closeModal}
          whileTap={{ scale: 0.9, shadow: "0px 0px 15px rgba(0,0,0,0.3)" }} whileHover={{ scale: 1.1 }}
          className="fa-solid fa-circle-xmark text-main text-3xl cursor-pointer"></motion.i>
      </div>

      <motion.div
        className="relative overflow-hidden rounded-b-2xl bg-white shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#ed1e26]/20 to-[#ff5b60]/20 dark:from-[#ed1e26]/10 dark:to-[#ff5b60]/10 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#ff5b60]/20 to-[#ff8a8e]/20 dark:from-[#ff5b60]/10 dark:to-[#ff8a8e]/10 blur-3xl opacity-70"></div>

        <div className="relative p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h2>
            <p className="text-gray-600  text-sm">
              Enter your Email and password to access your account.
            </p>
          </motion.div>

          <form className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Input
                type="text"
                id="userName"
                label="Email"
                inputRef={inputRef}
                placeholder="Enter your Email"
                value={formValues.userName}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Input
                id="password"
                type="password"
                label="Password"
                isPasswordField={true}
                placeholder="Enter your password"
                value={formValues.password}
                onChange={handleChange}
                showPasswordToggle={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="flex items-center justify-end mt-2 text-sm"
            >
              <a href="#" className="text-[#ed1e26] hover:text-[#ff5b60] font-medium">
                Forgot password?
              </a>
            </motion.div>

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
              Sign In
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Don't have an account?{" "}
            <button onClick={changeForm} className="font-medium text-[#ed1e26] hover:text-[#ff5b60]">
              Sign up now
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Signin
