import { useState } from "react";
import { motion } from "framer-motion";

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
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

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
                    className={`absolute bottom-0 left-0 w-full bg-gradient-to-r ${errors && touched ? "from-red-400 to-red-600" : "from-[#ed1e26] to-[#ff5b60]"
                        } rounded-b-md transition-all duration-300`}
                />

                {/* Actual input field */}
                <input
                    ref={inputRef}
                    type={isPasswordField && passwordVisible ? "text" : type}
                    className={`w-full py-3 px-3 bg-transparent border-0 border-b-2 text-gray-800 text-base focus:ring-0 focus:outline-none ${errors && touched
                            ? "border-b-red-500"
                            : isFocused
                                ? "border-b-[#ed1e26]"
                                : "border-b-gray-300"
                        }`}
                    id={id}
                    placeholder={isFocused || !label ? placeholder : ""}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={() => setIsFocused(true)}
                />

                {/* Password visibility toggle */}
                {isPasswordField && showPasswordToggle && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-600"
                    >
                        {passwordVisible ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12l-3 3-3-3"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12l-3 3-3-3"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {/* Error message with animation */}
            {errors && touched && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="mt-1 flex items-center space-x-1 text-sm text-red-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>{errors}</span>
                </motion.div>
            )}
        </div>
    );
};

export default Input;
