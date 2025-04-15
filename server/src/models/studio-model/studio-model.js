const mongoose = require("mongoose");
const slugify = require("slugify");

const studioSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
            maxLength: [50, "Name must be less than 50 characters"],
        },

        slug: {
            type: String,
            lowercase: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        address: {
            type: String,
            required: [true, "Please provide an address"],
            trim: true,
            maxLength: [100, "Address must be less than 100 characters"],
        },

        pricePerHour: {
            type: Number,
            required: [true, "Please provide a price per hour"],
            min: [0, "Price must be greater than or equal to 0"],
        },

        description: {
            type: String,
            required: [true, "Please provide a description"],
            trim: true,
            maxLength: [500, "Description must be less than 500 characters"],
        },

        facilities: {
            type: [String],
            validate: [(arr) => arr.length > 0, "At least one facility is required"],
        },

        equipment: {
            type: [String],
            validate: [
                (arr) => arr.length > 0,
                "At least one equipment item is required",
            ],
        },

        thumbnail: {
            type: String,
            required: [true, "Please provide a thumbnail"],
            trim: true,
        },

        imagesGallery: {
            type: [String],
            validate: [
                {
                    validator: function (val) {
                        return val.length > 0;
                    },
                    message: "At least one image is required.",
                },
                {
                    validator: function (val) {
                        return val.length <= 5;
                    },
                    message: "You can upload a maximum of 5 images.",
                },
            ],
            required: true,
        },

        ratingAverage: {
            type: Number,
            default: 0,
            min: [0, "Rating must be above 0"],
            max: [5, "Rating must be below 5.0"],
        },

        ratingQuantity: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Auto-generate slug from name before saving
studioSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});


// images url 
const setImage = (doc) => {
    if (doc.thumbnail) {
        doc.thumbnail = `${process.env.BASE_URL}/uploads/studio/${doc.thumbnail}`;
    }
    if (doc.imagesGallery) {
        doc.imagesGallery = doc.imagesGallery.map(
            (img) => `${process.env.BASE_URL}/uploads/studio/${img}`
        );
    }
};

studioSchema.post("save", (doc) => {
    setImage(doc);
});

studioSchema.post("init", (doc) => {
    setImage(doc);
});

module.exports = mongoose.model("Studio", studioSchema);
