require("../models/studio-model/studio-model");
require("../models/add-on-model/add-on-model");
require("../models/hourly-packages-model/hourly-packages-model");
require("../models/user-model/user-model");
require("../models/category-model/category-model");

const mongoose = require("mongoose");
const Booking = require("../models/booking-model/booking-model");
const UserProfile = require("../models/user-profile-model/user-profile-model");

async function migratePersonalInfo() {
  try {
    // await mongoose.connect(
    //   "mongodb+srv://abdelhakem:gUWwV4BpMRv8z9f2@dottopia.gjvd3.mongodb.net/goocast?retryWrites=true&w=majority&appName=dottopia"
    // );

    await mongoose.connect(
      "mongodb://goocast_app:G00cast$app_2025@mongo.dottopia.com:27017/goocast?authSource=goocast"
    );

    console.log("Migration started...");
    //  Get all Booking
    const bookings = await Booking.find({});

    // Loop in all Booking
    for (const booking of bookings) {
      // extract user data from each booking
      const info = booking.personalInfo;

      // If not found user has email or phone skip it
      if (!info?.email || !info?.phone) {
        console.log("Skipping booking without personalInfo:", booking._id);
        continue;
      }

      // get  booked user
      let user = await UserProfile.findOne({
        $or: [{ email: info.email }, { phone: info.phone }],
      });

      // If not found
      if (user) {
        booking.personalInfo = user._id;
        console.log("Edit Value With  new id:", user._id);
      }

      await booking.save();

      console.log(`Updated booking ${booking._id} with user ${user?._id}`);
    }

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

migratePersonalInfo();
