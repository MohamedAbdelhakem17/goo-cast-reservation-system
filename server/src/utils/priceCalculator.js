const PriceException = require("../models/price-exception-model/price-exception-model");
const PriceRule = require("../models/price-exception-model/price-exception-model");
const { minutesToTime, getAllDay } = require("./time-mange");

const calculateSlotPrices = async ({ studio, date, startSlotMinutes, endOfDay, bookedSlots }) => {
    const dayOfWeek = new Date(date).getDay();
    const inputDate = getAllDay(date);

    // Check if there is a price exception
    const exception = await PriceException.findOne({
        studio: studio._id,
        date: { $gte: inputDate.startOfDay, $lt: inputDate.endOfDay },
    });

    // Check if there is a price rule
    const rule = await PriceRule.findOne({
        studio: studio._id,
        dayOfWeek: dayOfWeek,
    });

    // Set default values
    let defaultPricePerSlot = studio.basePricePerSlot;
    let isFixedHourly = studio.isFixedHourly;
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
    let totalPrice = 0;
    let slotCount = 0;
    
    // 120 For start from 2 hours || 60 For start from 1 hour
    const minStartTime  = 120
    for (let time = startSlotMinutes + minStartTime; time <= endOfDay; time += 60) {
        slotCount++;

        const isOverlapping = bookedSlots.some(b => startSlotMinutes < b.end && time > b.start);
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
