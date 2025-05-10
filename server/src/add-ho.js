const mongoose = require("mongoose");
const hurlyPackageModel = require("./models/hourly-packages-model/hourly-packages-model");

mongoose
    .connect("mongodb+srv://abdelhakem:gUWwV4BpMRv8z9f2@dottopia.gjvd3.mongodb.net/goocast?retryWrites=true&w=majority&appName=dottopia")
    .then(() => {
        console.log("Connected to MongoDB");
        seedCategories();
    })
    .catch((err) => console.error("Connection error:", err));

const hourlyPackages = [
    {
        name: "Goo Social",
        target_audience: ["Content creators", "Solo video creators"],
        description: "For content creators who want to shoot solo videos with editing.",
        category: "681c913473e625151f4f075e",
        details: [
            "Up to 2 hours recording",
            "Fully equipped podcast set of your choice",
            "1x cinema camera Sony FX30 and 1x RODE wireless mic",
            "Professional audio mixer",
            "Teleprompter"
        ],
        post_session_benefits: ["6 standard reels"],
        price: 10000,
        isFixed: true
    },
    {
        name: "Goo Social+",
        target_audience: ["Content creators", "Solo video creators"],
        description: "For content creators who want to shoot solo videos with editing.",
        category: "681c913473e625151f4f075e",
        details: [
            "Up to 4 hours recording",
            "Fully equipped podcast set of your choice",
            "1x cinema camera Sony FX30 and 1x RODE wireless mic",
            "Professional audio mixer",
            "Teleprompter"
        ],
        post_session_benefits: ["12 standard reels"],
        price: 18000,
        isFixed: true
    },
    {
        name: "Goo Podcast",
        target_audience: ["Content creators", "Podcast creators"],
        description: "For content creators who want to shoot podcast videos with good quality of editing.",
        category: "681c913473e625151f4f075e",
        details: [
            "Up to 2 hours recording",
            "Fully equipped podcast set of your choice",
            "Studio operator to record everything for you",
            "2x cinema cameras and 2x Shure mics",
            "Professional audio mixer",
            "Live cutting of your video with synced audio"
        ],
        post_session_benefits: [
            "1 edited episode with logo/music integration and trimming",
            "6 standard reels"
        ],
        price: 12000,
        isFixed: true
    },
    {
        name: "Goo Podcast+",
        target_audience: ["Content creators", "Podcast creators"],
        description: "For content creators who want to shoot podcast videos with good quality of editing.",
        category: "681c913473e625151f4f075e",
        details: [
            "Up to 2 hours recording",
            "Fully equipped podcast set of your choice",
            "Studio operator to record everything for you",
            "2x cinema cameras and 2x Shure mics",
            "Professional audio mixer",
            "Live cutting of your video with synced audio"
        ],
        post_session_benefits: [
            "1 edited episode with logo/music integration and trimming",
            "12 standard reels"
        ],
        price: 18000,
        isFixed: true
    },
    {
        name: "Goo Social ",
        target_audience: ["Content creators", "Solo video creators"],
        description: "For content creators who want to shoot solo videos.",
        category: "681c913473e625151f4f075d",
        details: [
            "Fully equipped set of your choice",
            "Professional audio mixer",
            "1x cinema camera Sony FX30 and 1x RODE wireless mic"
        ],
        post_session_benefits: ["Raw audio and video files transferred to your own hard drive"],
        price: 8000,
        isFixed: false,
    },
    {
        name: "Goo Podcast ",
        target_audience: ["Content creators", "Solo video creators"],
        description: "For content creators who want to shoot Podcast videos. , with good quality",
        category: "681c913473e625151f4f075d",
        details: [
            "Fully equipped Podcast Set of your choice",
            "Studio operator to record everything for you",
            "Professional audio mixer",
            "2x cinema camera Sony FX30 and 2x Shure mics"
        ],
        post_session_benefits: ["Raw audio and video files transferred to your own hard drive", "Live mixed episode ready to be published in Horizontal forma"], 
        price: 8000,
        isFixed: false,
    }
];


async function seedCategories() {
    try {

        await hurlyPackageModel.deleteMany();

        const created = await hurlyPackageModel.insertMany(hourlyPackages);
        console.log("Seeded categories:", created);

        process.exit();
    } catch (err) {
        console.error("Error seeding categories:", err);
        process.exit(1);
    }
}

// ();

// seedStudios();