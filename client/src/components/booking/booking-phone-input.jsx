import { motion } from "framer-motion";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const BookingPhoneInput = ({
  label,
  value,
  onChange,
  onBlur,
  errors,
  touched,
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-8">
      {/* Label */}
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>

      {/* PhoneInput */}
      <PhoneInput
        country={"eg"}
        onlyCountries={["eg", "sa", "ae"]}
        preferredCountries={["eg", "sa", "ae"]}
        value={value}
        onChange={onChange}
        inputProps={{
          name: "personalInfo.phone",
          required: true,
          autoFocus: true,
          onFocus: () => setIsFocused(true),
          onBlur: (e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          },
          disabled,
        }}
        containerStyle={{ width: "100%" }}
        inputStyle={{
          width: "100%",
          padding: "20px 70px",
          fontSize: "14px",
          borderRadius: "6px",
          border: errors && touched ? "1px solid #f56565" : "1px solid #d1d5db",
          backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
        }}
        buttonStyle={{
          padding: "10px",
        }}
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
  );
};

export default BookingPhoneInput;
