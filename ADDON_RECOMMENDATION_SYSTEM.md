# Add-on Recommendation System Documentation

## Overview

The Add-on Recommendation System provides intelligent, context-aware suggestions to users during the booking process. The system analyzes booking details (group size, selected package, etc.) and dynamically recommends relevant add-ons to enhance the user's experience.

## Features

### 🎯 Dynamic Recommendations

- **Group Size-Based**: Recommends equipment based on the number of participants
- **Package-Based**: Suggests add-ons that complement the selected package
- **Universal**: Highlights add-ons beneficial for all bookings
- **Smart Hiding**: Automatically hides add-ons already included in packages

### 🎨 User Experience

- **Visual Hierarchy**: Recommended add-ons displayed first with distinctive badges
- **Clear Reasoning**: Each recommendation includes an explanation
- **Real-time Updates**: Recommendations update as booking details change
- **Organized Sections**: Add-ons grouped into "Recommended" and "Other" categories

## Architecture

### Frontend Components

#### 1. **useAddonRecommendations Hook**

Location: `client/src/hooks/use-addon-recommendations.js`

Core logic hook that analyzes booking data and generates recommendations.

**Parameters:**

```javascript
{
  addons: Array,        // All available add-ons
  bookingData: Object,  // Current booking context
  t: Function,          // Translation function
  lng: String          // Current language (en/ar)
}
```

**Returns:**

```javascript
{
  recommended: Array,   // Add-ons with recommendations
  regular: Array,       // Non-recommended add-ons
  hiddenAddons: Array  // Add-ons hidden due to package inclusion
}
```

#### 2. **UI Components**

**RecommendationBadge** (`client/src/components/booking/recommendation-badge.jsx`)

- Displays visual badges on recommended add-ons
- Variants: default, popular, group, universal
- Example: "Recommended for groups of 4+"

**RecommendationReason** (`client/src/components/booking/recommendation-reason.jsx`)

- Shows explanatory text for why an add-on is recommended
- Icon-based design for visual appeal
- Example: "Capture multiple angles for larger groups"

**AddonSectionHeader** (`client/src/components/booking/addon-section-header.jsx`)

- Section headers with icons and count badges
- Separates recommended from other add-ons

#### 3. **Updated Select Add-ons Component**

Location: `client/src/features/booking/_components/steps/select-additional-services/_components/select-addons.jsx`

Enhanced to:

- Use recommendation hook
- Display add-ons in prioritized sections
- Show recommendation badges and reasons
- Hide package-included add-ons with notification

### Backend Model Enhancement

#### Updated Add-on Schema

Location: `server/src/models/add-on-model/add-on-model.js`

**New Fields:**

```javascript
{
  // Categorization
  category: {
    type: String,
    enum: ["equipment", "editing", "production", "accessibility", "other"]
  },

  tags: [String],  // For flexible filtering

  // Recommendation Rules
  recommendation_rules: {
    min_persons: Number,           // Recommend if persons >= value
    max_persons: Number,           // Recommend if persons <= value
    recommended_for_packages: [String],  // Package names/slugs
    excluded_from_packages: [String],    // Hide for these packages
    is_universal_recommendation: Boolean, // Always recommend
    priority: Number               // Higher = shown first (0-10)
  }
}
```

## Recommendation Rules

### Rule 1: Group Size-Based Recommendations

```
IF number_of_persons > 3 THEN
  RECOMMEND:
    - Additional Camera
      Badge: "Recommended for groups of 4+"
      Reason: "Capture multiple angles for larger groups"
      Priority: 3

    - Additional Microphone
      Badge: "Recommended for groups of 4+"
      Reason: "Ensure clear audio for all participants"
      Priority: 3
END IF
```

### Rule 2: Package-Based Hiding

```
IF package_name CONTAINS "reel" AND
   addon_name CONTAINS "standard reel edit" THEN
  HIDE addon
  SHOW message: "✓ Standard Reel Edit included in your package"
END IF
```

### Rule 3: Package-Based Recommendations

```
IF package_name CONTAINS "first" OR "basic" THEN
  RECOMMEND:
    - Episode Edit
      Badge: "Popular upgrade"
      Reason: "Enhance your basic package with professional episode editing"
      Priority: 2
END IF
```

### Rule 4: Universal Recommendations

```
FOR all packages DO
  RECOMMEND:
    - Subtitles
      Badge: "Recommended for all bookings"
      Reason: "Increase accessibility and reach"
      Priority: 1
END FOR
```

## Translation Keys

### English (en.json)

```json
{
  "addon-included-in-package": "Included in your package",
  "addon-section-recommended": "Recommended for You",
  "addon-section-other": "Other Add-ons",
  "addon-section-all": "All Add-ons",
  "addon-reason-group-camera": "Capture multiple angles for larger groups",
  "addon-reason-group-microphone": "Ensure clear audio for all participants",
  "addon-reason-episode-edit": "Enhance your basic package with professional episode editing",
  "addon-reason-subtitles": "Increase accessibility and reach",
  "addon-badge-large-groups": "Recommended for groups of 4+",
  "addon-badge-popular-upgrade": "Popular upgrade",
  "addon-badge-recommended-all": "Recommended for all bookings"
}
```

### Arabic (ar.json)

Equivalent translations provided for RTL support.

## Usage Examples

### For Administrators: Setting Up Add-on Recommendations

You can configure recommendations in two ways:

#### Option 1: Database-Driven (Future Enhancement)

Update add-ons via the admin panel with recommendation rules:

```javascript
{
  name: { en: "Additional Camera", ar: "كاميرا إضافية" },
  category: "equipment",
  tags: ["video", "recording"],
  recommendation_rules: {
    min_persons: 4,
    priority: 3
  }
}
```

#### Option 2: Code-Based (Current Implementation)

Recommendations are determined by the hook's logic based on add-on names and booking context.

### For Developers: Extending Recommendations

To add new recommendation rules, edit `use-addon-recommendations.js`:

```javascript
// Example: Recommend lighting for video packages
if (packageName.toLowerCase().includes("video")) {
  if (addonNameEn.includes("lighting")) {
    recommendation.isRecommended = true;
    recommendation.reason = t("addon-reason-video-lighting");
    recommendation.badge = t("addon-badge-video-essential");
    recommendation.priority = 2;
    return recommendation;
  }
}
```

## Testing Scenarios

### Scenario 1: Large Group Booking

- **Given**: User selects 5 persons
- **Expected**:
  - "Additional Camera" and "Additional Microphone" appear in "Recommended for You"
  - Badge: "Recommended for groups of 4+"
  - Reasons displayed below each add-on

### Scenario 2: Reel Package Selection

- **Given**: User selects "Reel Package"
- **Expected**:
  - "Standard Reel Edit" is hidden
  - Green notification shows "✓ Standard Reel Edit included in your package"

### Scenario 3: First Package Selection

- **Given**: User selects "First Package" or "Basic Package"
- **Expected**:
  - "Episode Edit" appears in recommended section
  - Badge: "Popular upgrade"
  - Reason explains the benefit

### Scenario 4: Universal Recommendations

- **Given**: Any package selected
- **Expected**:
  - "Subtitles" appears in recommended section
  - Badge: "Recommended for all bookings"

## UI/UX Flow

```
┌─────────────────────────────────────────────┐
│  Package Inclusion Alert (if applicable)   │
│  ✓ Some add-ons included in your package   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  ⭐ Recommended for You                     │
│  ┌───────────┐  ┌───────────┐             │
│  │ Add-on 1  │  │ Add-on 2  │             │
│  │ [Badge]   │  │ [Badge]   │             │
│  │ [Reason]  │  │ [Reason]  │             │
│  │ [Price]   │  │ [Price]   │             │
│  │ [Actions] │  │ [Actions] │             │
│  └───────────┘  └───────────┘             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  📦 Other Add-ons                           │
│  ┌───────────┐  ┌───────────┐             │
│  │ Add-on 3  │  │ Add-on 4  │             │
│  │ [Price]   │  │ [Price]   │             │
│  │ [Actions] │  │ [Actions] │             │
│  └───────────┘  └───────────┘             │
└─────────────────────────────────────────────┘
```

## Performance Considerations

- **Memoization**: `useMemo` prevents unnecessary recalculations
- **Efficient Filtering**: Single pass through add-ons array
- **Lazy Loading**: Images use `loading="lazy"` attribute
- **Animation**: Framer Motion with stagger for smooth rendering

## Future Enhancements

1. **Machine Learning**: Use historical booking data to improve recommendations
2. **A/B Testing**: Test different recommendation strategies
3. **Personalization**: User-specific recommendations based on previous bookings
4. **Analytics**: Track recommendation acceptance rates
5. **Admin UI**: Interface for configuring recommendation rules without code changes
6. **Dynamic Pricing**: Show savings when selecting recommended combos

## API Integration (Optional)

For server-side recommendation generation:

```javascript
// Endpoint: POST /api/v1/addons/recommendations
{
  "persons": 5,
  "packageId": "64abc123...",
  "duration": 2
}

// Response:
{
  "recommended": [...],
  "regular": [...],
  "hidden": [...]
}
```

## Troubleshooting

### Issue: Recommendations not appearing

- Check that booking data has `persons` and `selectedPackage` fields
- Verify add-on names match the patterns in the hook (case-insensitive)
- Check console for translation key errors

### Issue: Wrong add-ons hidden

- Review package name matching logic
- Ensure add-on names are consistent (e.g., "Standard Reel Edit")

### Issue: Translations missing

- Verify all keys exist in both `en.json` and `ar.json`
- Check language context is properly passed to components

## Contributing

When adding new recommendation rules:

1. Document the business logic
2. Add corresponding translation keys
3. Test with multiple scenarios
4. Update this documentation

## License

Part of the Goo Cast Studio Reservation System.
