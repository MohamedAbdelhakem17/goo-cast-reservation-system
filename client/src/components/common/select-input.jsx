import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  iconClass = "fas fa-chevron-down",
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options?.find((opt) => opt.value === value);

  return (
    <div className={`relative mb-6 ${className ? className : "w-48"}`} ref={dropdownRef}>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      )}

      {/* Trigger */}
      <div
        className="relative cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm transition focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500 hover:border-rose-400"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="absolute inset-y-0 end-3 flex items-center pr-3 text-gray-500">
          <i
            className={`${iconClass} transition-transform ${isOpen ? "rotate-180" : ""}`}
          ></i>
        </div>
      </div>

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
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
