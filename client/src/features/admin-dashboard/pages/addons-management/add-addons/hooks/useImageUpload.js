import { useEffect, useMemo } from "react";

/**
 * Custom hook to manage image upload and preview
 * @param {File|string} imageValue - Current image value (File or URL string)
 * @returns {Object} Image URL and handler
 */
export const useImageUpload = (imageValue) => {
  // Generate preview URL for File objects
  const imageUrl = useMemo(() => {
    if (imageValue instanceof File) {
      return URL.createObjectURL(imageValue);
    }
    return null;
  }, [imageValue]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  /**
   * Get the display URL for the image
   * @returns {string|null} URL to display
   */
  const getDisplayUrl = () => {
    if (imageValue instanceof File) {
      return imageUrl;
    }
    return imageValue || null;
  };

  return {
    displayUrl: getDisplayUrl(),
    isFile: imageValue instanceof File,
  };
};
