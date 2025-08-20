const cron = require("node-cron");
const axios = require("axios");
const ReviewModel = require("../../models/review-model/review-model");
const asyncHandler = require("express-async-handler");

cron.schedule("0 0 */3 * *", () => {
  getPlaceReviews();
});

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = process.env.PLACE_ID;
const FRESH_DAYS = 5;
const MS_IN_DAY = 1000 * 60 * 60 * 24;

async function getPlaceReviews() {
  const cached = await ReviewModel.findOne({ placeId: PLACE_ID });

  const now = new Date();
  const lastUpdated = cached?.lastUpdated || new Date(0);
  const diffInDays = (now - lastUpdated) / MS_IN_DAY;

  const isStale = !cached || diffInDays >= FRESH_DAYS;

  if (!isStale) {
    return { data: cached.data, new: false };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    const result = response.data.result;

    const filteredReviews = (result?.reviews || []).filter(
      (review) => review.text && review.text.trim() !== ""
    );

    result?.reviews ? (result.reviews = filteredReviews) : "";

    let isNew = false;
    if (!cached || result?.user_ratings_total > (cached.userRatingsTotal || 0)) {
      isNew = true;
    }

    await ReviewModel.findOneAndUpdate(
      { placeId: PLACE_ID },
      {
        data: result,
        lastUpdated: now,
      },
      { upsert: true }
    );

    return { data: result, new: isNew };
  } catch (error) {
    console.error("Error fetching place reviews:", error);
    return { data: cached?.data || null, new: false };
  }
}

exports.getPlaceReviews = asyncHandler(async (req, res, next) => {
  const { data, new: isNew } = await getPlaceReviews();

  res.status(200).json({
    status: "success",
    data,
    new: isNew,
  });
});

getPlaceReviews();
