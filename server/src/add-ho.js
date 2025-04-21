require("dotenv").config();
const mongoose = require("mongoose");
const bookingModel = require("./models/booking-model/booking-model");

mongoose
    .connect("mongodb+srv://abdelhakem:gUWwV4BpMRv8z9f2@dottopia.gjvd3.mongodb.net/goocast?retryWrites=true&w=majority&appName=dottopia")
    .then(() => {
        console.log("Connected to MongoDB");
        seedStudios();
    })
    .catch((err) => console.error("Connection error:", err));

const bookings = [
    ...Array.from({ length: 9 }, (_, i) => {
        const hour = 9 + i;
        return {
            studio: "67ff9a16a00f7d817b42bb4a", // Urban Vision Studio
            date: new Date("2025-04-24"),
            timeSlot: `${String(hour).padStart(2, "0")}:00`,
            duration: 1,
            persons: 2,
            package: "67fe829d6297fbb9198404d8", // Go-Social
            addOns: [
                {
                    item: "67fe85767663f45575657bea", // Additional Camera
                    quantity: 1,
                    price: 2000,
                },
                {
                    item: "67fe85767663f45575657beb", // Additional Mic
                    quantity: 1,
                    price: 1000,
                }
            ],
            personalInfo: {
                fullName: `User ${hour}`,
                phone: `+1-202-555-01${hour}`,
                email: `user${hour}@mail.com`,
                brand: `Brand ${hour}`,
            },
            status: "approved",
            totalPrice: 8000 + 2000 + 1000, // Go-Social (twoHours) + addons
            createdBy: "67fd254a52ebfdd02f561748",
        };
    }),

    // Adding a second day with partial bookings
    ...Array.from({ length: 5 }, (_, i) => {
        const hour = 12 + i;  // Starting from 12 PM for the second day
        return {
            studio: "67ff9a16a00f7d817b42bb4b", // Sunlight Studio
            date: new Date("2025-04-21"),
            timeSlot: `${String(hour).padStart(2, "0")}:00`,
            duration: 1,
            persons: 3,
            package: "67fe829d6297fbb9198404d9", // Go-Podcast
            addOns: [
                {
                    item: "67fe85767663f45575657bec", // Teleprompter
                    quantity: 1,
                    price: 800,
                },
                {
                    item: "67fe85767663f45575657bef", // 1 Signature Reel Edit
                    quantity: 1,
                    price: 1500,
                },
            ],
            personalInfo: {
                fullName: `User Partial ${hour}`,
                phone: `+1-202-555-02${hour}`,
                email: `user.partial${hour}@mail.com`,
                brand: `Brand Partial ${hour}`,
            },
            status: "pending",  // Changing status to pending for partial bookings
            totalPrice: 10000 + 800 + 1500, // Go-Podcast (twoHours) + addons
            createdBy: "67fd254a52ebfdd02f561748",
        };
    })
];


async function seedStudios() {
    try {
        await bookingModel.insertMany(bookings);
        console.log("Studios seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

// seedStudios();