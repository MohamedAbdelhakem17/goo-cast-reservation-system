import { useState } from "react";
import { motion } from "framer-motion";
import ErrorFeedback from "./error-feedback";

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
  isPasswordField = false,
  inputRef,
  onBlur,
  className,
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isDateType = type === "date";

  // ✅ Detect if the value is Arabic
  const isArabic = /^[\u0600-\u06FF]/.test(value);

  return (
    <div className={`relative mb-8 ${className}`}>
      <motion.label
        initial={{ x: 0, opacity: 0.9 }}
        animate={
          isFocused || value
            ? { x: 0, y: -24, opacity: 1, scale: 0.85 }
            : {
                x: isDateType ? 0 : 12,
                y: isDateType ? -24 : 0,
                opacity: isDateType ? 1 : value ? 0 : 0.7,
                scale: isDateType ? 0.85 : 1,
              }
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`pointer-events-none absolute left-0 text-base font-medium tracking-wide text-gray-600 dark:text-gray-500 ${
          isDateType ? "text-xs" : ""
        }`}
        htmlFor={id}
      >
        {label}
      </motion.label>

      <div className="relative">
        <motion.div
          initial={{ height: "2px", opacity: 0.5 }}
          animate={
            isFocused
              ? { height: "100%", opacity: 0.05 }
              : { height: "2px", opacity: errors && touched ? 0.2 : 0.1 }
          }
          className={`absolute bottom-0 left-0 w-full bg-gradient-to-r ${
            errors && touched ? "from-red-400 to-red-600" : "from-[#ed1e26] to-[#ff5b60]"
          } rounded-b-md transition-all duration-300`}
        />

        {isDateType && (
          <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <input
          ref={inputRef}
          type={isPasswordField && showPasswordToggle ? "text" : type}
          className={`w-full px-3 py-3 ${isDateType ? "pr-12" : ""} border-0 border-b-2 bg-transparent text-base text-gray-800 focus:ring-0 focus:outline-none ${
            errors && touched
              ? "border-b-red-500"
              : isFocused
                ? "border-b-[#ed1e26]"
                : "border-b-gray-300"
          } ${
            isDateType
              ? "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
              : ""
          }`}
          id={id}
          placeholder={isFocused || !label || isDateType ? placeholder : ""}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          dir={isArabic ? "rtl" : "ltr"}
        />
      </div>

      {errors && touched && <ErrorFeedback>{errors}</ErrorFeedback>}
    </div>
  );
};

export default Input;
