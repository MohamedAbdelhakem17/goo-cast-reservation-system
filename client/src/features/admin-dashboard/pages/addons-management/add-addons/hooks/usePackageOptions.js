import { useMemo } from "react";

/**
 * Custom hook to prepare package options for react-select
 * @param {Object} packages - Packages data from API
 * @param {string} lng - Current language
 * @returns {Array} Array of package options for react-select
 */
export const usePackageOptions = (packages, lng) => {
  return useMemo(() => {
    if (!packages?.data) return [];
    return packages.data.map((pkg) => ({
      value: pkg._id,
      label: pkg.name?.[lng] || pkg.name?.en || pkg.name?.ar || pkg._id,
      name: pkg.name,
    }));
  }, [packages, lng]);
};
