import { format } from "date-fns";

// Utility: Format date safely
export const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return "Invalid date";
  }
};

// Utility: Toggle promotion active status
export const handleToggleActive = async (promotionId, newValue) => {
  try {
    // TODO: Implement API call to update isActive status
    console.log(`Toggle isActive for promotion ${promotionId} to:`, newValue);
    // Example: await updatePromotionStatus(promotionId, { isActive: newValue });
    return true; // Return true on success, false on failure
  } catch (error) {
    console.error("Failed to update promotion status:", error);
    return false;
  }
};
