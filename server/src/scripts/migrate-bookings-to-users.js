// scripts/migrateBookingsToUsers.js

require("../models/studio-model/studio-model");
require("../models/add-on-model/add-on-model");
require("../models/hourly-packages-model/hourly-packages-model");
require("../models/user-model/user-model");
require("../models/category-model/category-model");

const mongoose = require("mongoose");
const Booking = require("../models/booking-model/booking-model");
const UserProfile = require("../models/user-profile-model/user-profile-model");
const determineUserTags = require("../utils/tag-engine");

async function runMigration() {
  await mongoose.connect(
    "mongodb+srv://abdelhakem:gUWwV4BpMRv8z9f2@dottopia.gjvd3.mongodb.net/goocast?retryWrites=true&w=majority&appName=dottopia"
  );

  console.log("Migration started...");

  const bookings = await Booking.find({});
  console.log(`Found ${bookings.length} bookings`);

  for (const booking of bookings) {
    // console.log(booking);

    // return;
    const info = booking.personalInfo;
    if (!info || !info.email) {
      console.log(`Booking ${booking._id} skipped — no email`);
      continue;
    }

    // check if user already exists
    let user = await UserProfile.findOne({
      $or: [{ email: info.email }, { phone: info.phone }],
    });
    // If not found → create new user profile
    if (!user) {
      user = await UserProfile.create({
        firstName: info.fullName?.split(" ")[0] || "User",
        lastName: info.fullName?.split(" ").slice(1).join(" ") || "Unknown",
        email: info.email || `${info.phone}@placeholder.com`,
        phone: info.phone,
        avatar: "US",
      });

      console.log(`Created new user: ${user.phone}`);
    }

    // Update userActivity
    user.userActivity.totalBookingTimes += 1;
    user.userActivity.totalSpent +=
      booking.totalPriceAfterDiscount || booking.totalPrice;
    user.userActivity.lastBookingTime = booking.date;

    // add booking to the list (avoid duplicates)
    if (!user.userActivity.allUserBooking.includes(booking._id)) {
      user.userActivity.allUserBooking.push(booking._id);
    }

    // Set nextBooking to the most recent booking
    if (
      !user.userActivity.nextBooking ||
      new Date(booking.date) > new Date(user.userActivity.lastBookingTime)
    ) {
      user.userActivity.nextBooking = booking._id;
    }

    // 🔥 Apply new tags logic
    const newTags = determineUserTags(user);

    user.tags = newTags;

    await user.save();

    console.log(`Updated userActivity for user: ${user._id}`);
  }

  console.log("Migration finished.");
  process.exit(0);
}

runMigration().catch((err) => {
  console.error(err);
  process.exit(1);
});
