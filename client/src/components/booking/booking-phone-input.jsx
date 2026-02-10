import { motion } from "framer-motion";
import { useContext, useState } from "react";
import PhoneInput from "react-phone-input-2";
import ar from "react-phone-input-2/lang/ar.json";
import "react-phone-input-2/lib/style.css";
import { LocalesContext } from "../../context/localization-provider/localization-context";

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
  const { lng } = useContext(LocalesContext);

  return (
    <div className="relative mb-8">
      {/* Label */}
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* PhoneInput */}
      <PhoneInput
        country={"eg"}
        onlyCountries={["eg", "sa", "ae"]}
        preferredCountries={["eg", "sa", "ae"]}
        value={value}
        onChange={onChange}
        localization={lng === "ar" ? ar : {}}
        enableSearch={true}
        searchPlaceholder={lng === "ar" ? "بحث..." : "Search..."}
        inputProps={{
          name: "personalInfo.phone",
          required: true,
          onFocus: () => setIsFocused(true),
          onBlur: (e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          },
          disabled,
          dir: lng === "ar" ? "ltr" : "ltr", // Phone numbers are always LTR
        }}
        containerStyle={{ width: "100%" }}
        inputStyle={{
          width: "100%",
          padding: "20px 70px",
          fontSize: "14px",
          borderRadius: "6px",
          border: errors && touched ? "1px solid #f56565" : "1px solid #d1d5db",
          backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
          color: "#1f2937",
          direction: "ltr", // Phone numbers are always LTR
        }}
        buttonStyle={{
          padding: "10px",
          backgroundColor: "transparent",
          ...(lng === "ar" && { right: 0, left: "auto" }), // Position flag on right for RTL
        }}
        dropdownStyle={{
          ...(lng === "ar" && { textAlign: "right" }), // Align dropdown text for RTL
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
