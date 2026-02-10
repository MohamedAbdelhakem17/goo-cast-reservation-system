/**
 * Extract package IDs from populated objects or use strings as-is
 * @param {Array} packages - Array of package objects or IDs
 * @returns {Array} Array of package IDs
 */
export const extractPackageIds = (packages) => {
  if (!packages || !Array.isArray(packages)) return [];
  return packages.map((pkg) => {
    // If populated, pkg will be an object with _id
    // If not populated, pkg will be a string ID
    return typeof pkg === "object" ? pkg._id : pkg;
  });
};

/**
 * Common styles for react-select components
 */
export const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: "44px",
    borderColor: "#e5e7eb",
    borderRadius: "0.375rem",
  }),
};

/**
 * Parse tags from comma-separated string
 * @param {string} value - Comma-separated tags
 * @returns {Array} Array of trimmed tags
 */
export const parseTagsFromString = (value) => {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

/**
 * Parse number input value with null for empty strings
 * @param {string} value - Input value
 * @returns {number|null} Parsed number or null
 */
export const parseNumberOrNull = (value) => {
  return value === "" ? null : parseInt(value);
};

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(max, Math.max(min, value || 0));
};
