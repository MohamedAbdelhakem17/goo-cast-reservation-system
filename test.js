const Booking = require("../models/booking-model");
const Studio = require("../models/studio-model");
const Package = require("../models/hourly-package-model");
const AddOn = require("../models/add-on-model");
const { calculateSlotPrices } = require("../utils/calculate-slot-prices");
const { getAllDay, timeToMinutes } = require("../utils/time-mange");

const createBooking = async (req, res) => {
    try {
        const {
            studio: studioId,
            date,
            timeSlot, // e.g., "10:00"
            duration, // in hours
            persons,
            package: packageId,
            addOns,
            personalInfo,
        } = req.body;

        const studio = await Studio.findById(studioId);
        if (!studio) return res.status(404).json({ error: "Studio not found" });

        const pkg = await Package.findById(packageId);
        if (!pkg) return res.status(404).json({ error: "Package not found" });

        const bookingDate = new Date(date);
        const startSlotMinutes = timeToMinutes(timeSlot);
        const endSlotMinutes = startSlotMinutes + duration * 60;

        // Get all bookings for the studio on that day
        const { startOfDay, endOfDay } = getAllDay(bookingDate);
        const sameDayBookings = await Booking.find({
            studio: studio._id,
            date: { $gte: startOfDay, $lt: endOfDay }
        });

        // Check for conflict
        const hasConflict = sameDayBookings.some(b => {
            const bStart = timeToMinutes(b.timeSlot);
            const bEnd = bStart + b.duration * 60;
            return startSlotMinutes < bEnd && endSlotMinutes > bStart;
        });

        if (hasConflict) {
            return res.status(409).json({ error: "Time slot already booked" });
        }

        // 🧮 احسب سعر الاستوديو باستخدام الدالة الذكية
        const bookedSlots = sameDayBookings.map(b => ({
            start: timeToMinutes(b.timeSlot),
            end: timeToMinutes(b.timeSlot) + b.duration * 60,
        }));

        const studioPricingResults = await calculateSlotPrices({
            studio,
            date: bookingDate,
            startSlotMinutes,
            endOfDay: timeToMinutes(studio.workHoursEnd || "23:59"),
            bookedSlots,
        });

        // خذ آخر totalPrice من النتيجة بعد عدد الساعات المطلوبة فقط
        const lastSlot = studioPricingResults[duration - 1];
        if (!lastSlot) return res.status(400).json({ error: "Invalid duration or pricing error" });
        const studioPrice = lastSlot.totalPrice;

        // 🧮 احسب سعر الباقة
        let packagePrice = 0;
        if (pkg.isFixed) {
            packagePrice = pkg.price;
        } else {
            for (let hour = 1; hour <= duration; hour++) {
                const discount = Number(pkg.perHourDiscounts.get(String(hour)) || 0);
                const priceAfterDiscount = pkg.price * (1 - discount / 100);
                packagePrice += priceAfterDiscount;
            }
        }

        // 🧮 احسب سعر الإضافات
        const addOnDetails = [];
        let addOnsTotal = 0;
        if (Array.isArray(addOns)) {
            for (const addOn of addOns) {
                const addOnItem = await AddOn.findById(addOn.item);
                if (!addOnItem) continue;

                const addOnPrice = addOnItem.price * addOn.quantity;
                addOnsTotal += addOnPrice;

                addOnDetails.push({
                    item: addOnItem._id,
                    quantity: addOn.quantity,
                    price: addOnItem.price,
                });
            }
        }

        const totalPrice = Math.round(studioPrice + packagePrice + addOnsTotal);

        const booking = await Booking.create({
            studio: studio._id,
            date: bookingDate,
            timeSlot,
            duration,
            persons,
            package: pkg._id,
            addOns: addOnDetails,
            personalInfo,
            totalPrice,
            status: "pending", // default
            createdBy: req.user?._id, // optional: if using authentication
        });

        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (err) {
        console.error("Booking creation failed:", err);
        res.status(500).json({ error: "Server error during booking creation" });
    }
};

module.exports = { createBooking };
