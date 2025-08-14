const PriceException = require("../models/price-exception-model/price-exception-model");
const PriceRule = require("../models/price-rule-model/price-rule-model");
const Category = require("../models/category-model/category-model");
const { minutesToTime, getAllDay } = require("./time-mange");
const { getCategoryMinHour } = require("./get-category-hour");

const calculateSlotPrices = async ({
  package,
  date,
  startSlotMinutes,
  endOfDay,
  bookedSlots,
}) => {
  const dayOfWeek = new Date(date).getDay();
  const inputDate = getAllDay(date);

  // Check if there is a price exception
  const exception = await PriceException.findOne({
    package: package._id,
    date: { $gte: inputDate.startOfDay, $lt: inputDate.endOfDay },
  });

  // Check if there is a price rule
  const rule = await PriceRule.findOne({
    package: package._id,
    dayOfWeek,
  });

  console.log(exception, "exception");
  console.log(rule, "rule");

  // Set default values
  let defaultPricePerSlot = package.price;
  let isFixedHourly = package.isFixed;
  let perSlotDiscounts = new Map();

  if (exception) {
    // If there is a price exception, use its values
    defaultPricePerSlot = exception.defaultPricePerSlot;
    isFixedHourly = exception.isFixedHourly;
    perSlotDiscounts = exception.perSlotDiscounts || new Map();
  } else if (rule) {
    // If there is a price rule, use its values
    defaultPricePerSlot = rule.defaultPricePerSlot;
    isFixedHourly = rule.isFixedHourly;
    perSlotDiscounts = rule.perSlotDiscounts || new Map();
  }

  const results = [];
  let totalPrice = 0; // Get Available Studio in a day

  let slotCount = 0;

  const minStartTime = await getCategoryMinHour(package.category._id);

  for (
  let time = startSlotMinutes + minStartTime;
  time <= endOfDay + 60;
  time += 60
)
 {
    slotCount++;

    const isOverlapping = bookedSlots.some(
      (b) => startSlotMinutes < b.end && time > b.start
    );
    if (isOverlapping) break;

    if (isFixedHourly) {
      totalPrice += defaultPricePerSlot;
    } else {
      const discount = Number(perSlotDiscounts.get(String(slotCount)) || 0);
      const priceAfterDiscount = defaultPricePerSlot * (1 - discount / 100);
      totalPrice += priceAfterDiscount;
    }

    results.push({
      endTime: minutesToTime(time),
      totalPrice: Math.round(totalPrice),
    });
  }

  return results;
};

module.exports = { calculateSlotPrices };
