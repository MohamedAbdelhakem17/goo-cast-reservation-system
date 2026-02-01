const validatePromotionDates = (startDate, endDate) => {
  const now = new Date();
  if (startDate < now) {
    return "Start date must be in the future.";
  }
  if (endDate <= startDate) {
    return "End date must be after start date.";
  }
  return null;
};

module.exports = validatePromotionDates;
