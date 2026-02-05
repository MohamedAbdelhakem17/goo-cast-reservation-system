/**
 * Migration Script: Add Recommendation Rules to Existing Add-ons
 *
 * This script updates existing add-ons in the database with recommendation metadata.
 * Run this once to initialize the recommendation system for existing data.
 *
 * Usage:
 * node src/scripts/migrate-addon-recommendations.js
 */

const mongoose = require("mongoose");
const AddOn = require("../models/add-on-model/add-on-model");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/goocast";

// Define recommendation configurations for common add-ons
const recommendationConfigs = {
  // Equipment - Recommended for large groups
  camera: {
    category: "equipment",
    tags: ["video", "recording", "camera"],
    recommendation_rules: {
      min_persons: 4,
      priority: 3,
    },
  },
  microphone: {
    category: "equipment",
    tags: ["audio", "recording", "microphone"],
    recommendation_rules: {
      min_persons: 4,
      priority: 3,
    },
  },

  // Editing Services
  "standard reel edit": {
    category: "editing",
    tags: ["editing", "reel", "post-production"],
    recommendation_rules: {
      excluded_from_packages: ["reel package", "reel"],
      priority: 0,
    },
  },
  "episode edit": {
    category: "editing",
    tags: ["editing", "episode", "post-production"],
    recommendation_rules: {
      recommended_for_packages: ["first package", "basic package", "basic"],
      priority: 2,
    },
  },

  // Accessibility - Universal recommendation
  subtitle: {
    category: "accessibility",
    tags: ["subtitle", "accessibility", "caption"],
    recommendation_rules: {
      is_universal_recommendation: true,
      priority: 1,
    },
  },
  subtitles: {
    category: "accessibility",
    tags: ["subtitle", "accessibility", "caption"],
    recommendation_rules: {
      is_universal_recommendation: true,
      priority: 1,
    },
  },
};

/**
 * Find matching configuration based on add-on name
 */
function findMatchingConfig(addonName) {
  const nameLower = addonName.toLowerCase();

  for (const [key, config] of Object.entries(recommendationConfigs)) {
    if (nameLower.includes(key)) {
      return config;
    }
  }

  return null;
}

/**
 * Main migration function
 */
async function migrateAddons() {
  try {
    console.log("🔄 Starting add-on recommendation migration...");

    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to database");

    // Fetch all add-ons
    const addons = await AddOn.find({});
    console.log(`📦 Found ${addons.length} add-ons to process`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const addon of addons) {
      const addonNameEn = addon.name?.en || "";
      const config = findMatchingConfig(addonNameEn);

      if (config) {
        // Update add-on with recommendation metadata
        addon.category = config.category;
        addon.tags = config.tags;
        addon.recommendation_rules = config.recommendation_rules;

        await addon.save();
        updatedCount++;
        console.log(`✅ Updated: ${addonNameEn} → ${config.category}`);
      } else {
        // Set default values for unknown add-ons
        addon.category = addon.category || "other";
        addon.tags = addon.tags || [];
        addon.recommendation_rules = addon.recommendation_rules || {
          priority: 0,
        };

        await addon.save();
        skippedCount++;
        console.log(`⚠️  Default set: ${addonNameEn}`);
      }
    }

    console.log("\n📊 Migration Summary:");
    console.log(`   ✅ Updated with rules: ${updatedCount}`);
    console.log(`   ⚠️  Set to defaults: ${skippedCount}`);
    console.log(`   📦 Total processed: ${addons.length}`);

    console.log("\n✨ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  }
}

/**
 * Rollback function (optional)
 */
async function rollbackMigration() {
  try {
    console.log("🔄 Rolling back recommendation metadata...");

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to database");

    const result = await AddOn.updateMany(
      {},
      {
        $unset: {
          category: "",
          tags: "",
          recommendation_rules: "",
        },
      },
    );

    console.log(
      `✅ Removed recommendation metadata from ${result.modifiedCount} add-ons`,
    );
    console.log("✨ Rollback completed!");
  } catch (error) {
    console.error("❌ Rollback failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// CLI argument handling
const args = process.argv.slice(2);
const command = args[0];

if (command === "rollback") {
  rollbackMigration();
} else if (command === "migrate" || !command) {
  migrateAddons();
} else {
  console.log("Usage:");
  console.log(
    "  node migrate-addon-recommendations.js migrate   # Run migration",
  );
  console.log(
    "  node migrate-addon-recommendations.js rollback  # Rollback changes",
  );
  process.exit(0);
}
