import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  iconClass = "fas fa-chevron-down",
  className,
  disabled = false, // NEW
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        !disabled &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [disabled]);

  const selectedOption = options?.find((opt) => opt.value === value);

  return (
    <div
      className={`relative mb-6 ${className ? className : "w-48"} ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
      ref={dropdownRef}
    >
      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      )}

      {/* Trigger */}
      <div
        className={`relative rounded-md border px-4 py-2 shadow-sm transition ${
          disabled
            ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
            : "cursor-pointer border-gray-300 bg-white text-gray-700 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500 hover:border-rose-400"
        } `}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="absolute inset-y-0 end-3 flex items-center pr-3 text-gray-500">
          <i
            className={`${iconClass} transition-transform ${
              isOpen && !disabled ? "rotate-180" : ""
            }`}
          ></i>
        </div>
      </div>

      {/* Dropdown List */}
      <AnimatePresence>
        {!disabled && isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 z-10 mt-1 max-h-60 w-full overflow-scroll rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            {options?.map((option) => (
              <li
                key={option.value}
                className={`cursor-pointer p-4 hover:bg-rose-50 ${
                  value === option.value ? "text-main bg-rose-100 font-medium" : ""
                }`}
                onClick={() => {
                  onChange({ target: { name, value: option.value } });
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
