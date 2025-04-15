const mongoose = require("mongoose");
const addsones = require("./models/add-on-model/add-on-model"); 



const addOns = [
    {
        id: "additional-camera",
        name: "Additional Camera",
        description:
            "Include an extra camera with lens in your recording to make your content more dynamic and increase viewer retention.",
        price: 2000,
        icon: "fa-video",
    },
    {
        id: "additional-mic",
        name: "Additional Mic",
        description: "Extra Shure mic for your guest in your podcast",
        price: 1000,
        icon: "fa-microphone",
    },
    {
        id: "teleprompter",
        name: "Teleprompter",
        description:
            "Boost your performance with a teleprompter, ensuring a confident introduction recording for your episode.",
        price: 800,
        icon: "fa-display",
    },
    {
        id: "subtitles",
        name: "Subtitles",
        description:
            "Enhance accessibility of your episodes with precise English subtitles, manually proofread for quality assurance. For episodes up to 60 minutes.",
        price: 1000,
        icon: "fa-closed-captioning",
    },
    {
        id: "episode-edit",
        name: "Episode Edit",
        description:
            "Get complete audio & video editing, logo/music integration, and removal of unwanted parts. For a single episode with up to 60 minutes of raw material. Two revision rounds",
        price: 1500,
        icon: "fa-scissors",
    },
    {
        id: "standard-reel",
        name: "1 Standard Reel Edit",
        description:
            "Engaging clip extracted from your edited episode, with subtitles. For clips up to 90 sec long, in vertical or horizontal format. Two revision rounds",
        price: 1000,
        icon: "fa-film",
    },
    {
        id: "signature-reel",
        name: "1 Signature Reel Edit",
        description:
            "Everything from the standard edit, plus a custom trailer designed to captivate your audience from the start. Two revision rounds",
        price: 1500,
        icon: "fa-star",
    },
    {
        id: "thumbnail",
        name: "Thumbnail Designs",
        description: "Designs of a vertical or horizontal thumbnail for your episode or reel",
        price: 200,
        icon: "fa-image",
    },
];

async function seed() {
    try {
        await mongoose.connect('mongodb+srv://abdelhakem:gUWwV4BpMRv8z9f2@dottopia.gjvd3.mongodb.net/goocast?retryWrites=true&w=majority&appName=dottopia', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ Connected to the database");

        await addsones.deleteMany(); // تفريغ الجدول لو عايز تبدأ من جديد
        await addsones.insertMany(addOns);

        console.log("✅ Hourly packages inserted successfully.");
        await mongoose.disconnect(); // إغلاق الاتصال بعد الانتهاء
        console.log("✅ Disconnected from the database.");
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding hourly packages:", err);
        process.exit(1);
    }
}

seed();
