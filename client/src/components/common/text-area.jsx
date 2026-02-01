import { motion } from "framer-motion";
import { useState } from "react";
import ErrorFeedback from "./error-feedback";

const Textarea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  errors,
  touched,
  inputRef,
  onBlur,
  className,
  rows = 2,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const isArabic = /^[\u0600-\u06FF]/.test(value);

  return (
    <div className={`relative mb-8 ${className}`}>
      {/* Floating label */}
      <motion.label
        initial={{ x: 0, opacity: 0.9 }}
        animate={
          isFocused || value
            ? { x: 0, y: -24, opacity: 1, scale: 0.85 }
            : { x: 12, y: 0, opacity: value ? 0 : 0.7, scale: 1 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pointer-events-none absolute start-0 text-base font-medium tracking-wide text-gray-600 dark:text-gray-500"
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
          className={`absolute bottom-1 left-0 w-full bg-gradient-to-r ${
            errors && touched ? "from-red-400 to-red-600" : "from-[#ed1e26] to-[#ff5b60]"
          } rounded-b-md transition-all duration-300`}
        />

        {/* Actual textarea field */}
        <textarea
          ref={inputRef}
          className={`w-full resize-none border-0 border-b-2 bg-transparent px-3 py-3 text-base text-gray-800 focus:ring-0 focus:outline-none ${isArabic && "font-arabic"} ${
            errors && touched
              ? "border-b-red-500"
              : isFocused
                ? "border-b-[#ed1e26]"
                : "border-b-gray-300"
          }`}
          id={id}
          name={name}
          placeholder={isFocused || !label ? placeholder : ""}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          rows={rows}
          dir={isArabic ? "rtl" : "ltr"}
        />
      </div>

      {/* Error message with animation */}
      {errors && touched && <ErrorFeedback>{errors}</ErrorFeedback>}
    </div>
  );
};

export default Textarea;
