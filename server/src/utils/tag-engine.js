function determineUserTags(user) {
  const tags = new Set();

  const { totalSpent, totalBookingTimes, lastBookingTime } = user.userActivity;
  const createdAt = user.createdAt;

  const now = Date.now();

  // ────────────────────────────────
  // TIME-BASED TAGS
  // ────────────────────────────────
  const monthsSinceCreation =
    (now - new Date(createdAt)) / (1000 * 60 * 60 * 24 * 30);
  if (monthsSinceCreation <= 1) tags.add("Recently Joined");
  if (monthsSinceCreation >= 12) tags.add("Old Member");

  // ────────────────────────────────
  // BOOKING-BASED TAGS
  // ────────────────────────────────
  if (totalBookingTimes === 0) {
    tags.add("New User");
  } else if (totalBookingTimes === 1) {
    tags.add("Active");
  } else {
    tags.delete("New User");
    tags.add("Returning");
  }

  // Frequent booking
  if (totalBookingTimes >= 5) tags.add("Frequent Booker");
  if (totalBookingTimes >= 10) tags.add("Loyal Customer");

  // ────────────────────────────────
  // INACTIVITY RULES
  // ────────────────────────────────
  if (lastBookingTime) {
    const monthsSinceLastBooking =
      (now - new Date(lastBookingTime)) / (1000 * 60 * 60 * 24 * 30);

    if (monthsSinceLastBooking >= 6) tags.add("Churn Risk");
    if (monthsSinceLastBooking >= 12) tags.add("Lost");
  }

  // ────────────────────────────────
  // SPENDING-BASED TAGS
  // ────────────────────────────────
  if (totalSpent < 1000) tags.add("Bronze");
  else if (totalSpent < 3000) tags.add("Silver");
  else if (totalSpent < 6000) tags.add("Gold");
  else if (totalSpent < 10000) tags.add("Platinum");
  else {
    tags.add("VIP");
    tags.add("Big Spender");
  }

  // High-value customers
  if (totalSpent >= 5000) tags.add("High Value");

  return Array.from(tags);
}

module.exports = determineUserTags;
