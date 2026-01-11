import { useGetAllUserProfiles } from "@/apis/admin/manage-user.api";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, User } from "lucide-react";
import { useMemo, useState } from "react";
import Select from "react-select";

const customStyles = {
  control: (base) => ({
    ...base,
    minHeight: "44px",
    borderColor: "#e5e7eb",
    borderRadius: "0.5rem",
    boxShadow: "none",
    backgroundColor: "#ffffff",
    borderWidth: "1px",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#d1d5db",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    },
    "&:focus": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
  }),
  input: (base) => ({ ...base, color: "#1f2937", fontSize: "0.875rem" }),
  placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "0.875rem" }),
  singleValue: (base) => ({ ...base, color: "#1f2937", fontSize: "0.875rem" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
        ? "#f3f4f6"
        : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#1f2937",
    padding: "10px 12px",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    "&:active": {
      backgroundColor: "#3b82f6",
    },
  }),
  menuList: (base) => ({ ...base, padding: "4px 0" }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.5rem",
    marginTop: "4px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
    border: "1px solid #e5e7eb",
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

export default function SelectUser({ setFieldValue, fieldName = "personalInfo" }) {
  // stet
  const [selectedUser, setSelectedUser] = useState(null);

  // Query
  const { users, isLoading, error } = useGetAllUserProfiles();

  // Hooks
  const options = useMemo(() => {
    if (!users) return [];
    return users.data.map((user) => ({
      value: user._id,
      label: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      user,
    }));
  }, [users]);

  // Loading case
  if (isLoading)
    return <div className="py-8 text-center text-sm text-gray-500">Loading users...</div>;

  // Error case
  if (error)
    return (
      <div className="py-8 text-center text-sm text-red-500">Error loading users</div>
    );

  // Selected user case
  if (selectedUser) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "linear" }}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          {/* User Info Header */}
          <div className="mb-6 flex items-center gap-4">
            {/* Icon */}
            <div className="bg-main/50 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-white">
              <User size={20} />
            </div>

            {/* Name and flag */}
            <div className="min-w-0 flex-1">
              {/* User name */}
              <h3 className="truncate text-base font-semibold text-gray-900">
                {selectedUser.firstName} {selectedUser.lastName}
              </h3>

              {/* Selected flag */}
              <p className="mt-1 text-xs text-gray-500">Selected User</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-6 space-y-3 border-b border-gray-100 pb-6">
            {/* Email */}
            <div className="flex items-center gap-3">
              {/* icon */}
              <Mail size={16} className="flex-shrink-0 text-gray-400" />

              {/* email Label */}
              <span className="truncate text-sm text-gray-700">{selectedUser.email}</span>
            </div>

            {/* Phon */}
            {selectedUser.phone && (
              <div className="flex items-center gap-3">
                {/* Icon */}
                <Phone size={16} className="flex-shrink-0 text-gray-400" />

                {/* Phone info */}
                <span className="text-sm text-gray-700">{selectedUser.phone}</span>
              </div>
            )}
          </div>

          {/* Change Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-md bg-gray-100 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
            onClick={() => {
              setSelectedUser(null);
              setFieldValue(fieldName, {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
              });
            }}
          >
            Change User
          </motion.button>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <Select
      options={options}
      placeholder="Search by name, email, or phone..."
      isClearable
      isSearchable
      styles={customStyles}
      onChange={(selected) => {
        if (!selected) {
          setSelectedUser(null);
          setFieldValue(fieldName, {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
          });
          return;
        }

        setSelectedUser(selected.user);
        setFieldValue(fieldName, {
          firstName: selected.user.firstName,
          lastName: selected.user.lastName,
          email: selected.user.email,
          phone: selected.user.phone || "",
        });
      }}
      filterOption={(option, inputValue) => {
        const search = inputValue.toLowerCase();
        return (
          option.label.toLowerCase().includes(search) ||
          option.data.email.toLowerCase().includes(search) ||
          option.data.phone?.includes(search)
        );
      }}
    />
  );
}
