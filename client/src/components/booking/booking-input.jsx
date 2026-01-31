import { motion } from "framer-motion";
import { useState } from "react";

const BookingInput = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  errors,
  touched,
  inputRef,
  onBlur,
  className = "",
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const showLabelFloating = isFocused || value;

  return (
    <div className={`mb-6 ${className}`}>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          id={id}
          className={`focus:gray-500 w-full rounded-md border bg-gray-200 px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-400 ${errors && touched ? "border-red-500" : "border-gray-300 dark:border-gray-600"} ${disabled ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "bg-gray-200 dark:bg-gray-700"}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          disabled={disabled}
        />

        {/* Error message */}
        {errors && touched && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-5 left-0 mt-1 flex items-center gap-1 text-xs text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingInput;
