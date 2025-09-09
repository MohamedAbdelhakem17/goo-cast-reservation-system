import { useState } from "react";
import { motion } from "framer-motion";
import { ErrorFeedback } from "@/components/common";

const Input = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  errors,
  touched,
  showPasswordToggle,
  // togglePasswordVisibility,
  isPasswordField = false,
  inputRef,
  onBlur,
  className,
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative mb-8 ${className}`}>
      {/* Floating label */}
      <motion.label
        initial={{ x: 0, opacity: 0.9 }}
        animate={
          isFocused || value
            ? {
                x: 0,
                y: -24,
                opacity: 1,
                scale: 0.85,
              }
            : { x: 12, y: 0, opacity: value ? 0 : 0.7, scale: 1 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute left-0 text-base font-medium tracking-wide text-gray-600 dark:text-gray-500 pointer-events-none"
        htmlFor={id}
      >
        {label}
      </motion.label>

      <div className="relative">
        {/* Background decoration element */}
        <motion.div
          initial={{ height: "2px", opacity: 0.5 }}
          animate={
            isFocused
              ? { height: "100%", opacity: 0.05 }
              : { height: "2px", opacity: errors && touched ? 0.2 : 0.1 }
          }
          className={`absolute bottom-0 left-0 w-full
            bg-gradient-to-r ${
              errors && touched
                ? "from-red-400 to-red-600"
                : "from-[#ed1e26] to-[#ff5b60]"
            }
            rounded-b-md transition-all duration-300`}
        />

        {/* Actual input field */}
        <input
          ref={inputRef}
          type={isPasswordField && showPasswordToggle ? "text" : type}
          className={`w-full py-3 px-3
            bg-transparent border-0 border-b-2 text-gray-800 text-base focus:ring-0 focus:outline-none ${
              errors && touched
                ? "border-b-red-500"
                : isFocused
                ? "border-b-[#ed1e26]"
                : "border-b-gray-300"
            }`}
          id={id}
          placeholder={isFocused || !label ? placeholder : ""}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
        />

        {/* Password toggle button with custom styling */}
        {/* {isPasswordField && (
        "password"
        )} */}
      </div>

      {/* Error message with animation */}
      {errors && touched && <ErrorFeedback>{errors}</ErrorFeedback>}
    </div>
  );
};

export default Input;
