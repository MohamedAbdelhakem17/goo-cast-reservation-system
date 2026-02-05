# Add-on Recommendation System - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Run the Migration Script

Update your existing add-ons with recommendation metadata:

```bash
cd server
node src/scripts/migrate-addon-recommendations.js migrate
```

### Step 2: Verify the Frontend

The recommendation system is now active! Test it by:

1. Go to the booking page
2. Select a package
3. Set the number of persons to 5+
4. Navigate to the "Additional Services" step
5. You should see:
   - "Recommended for You" section at the top
   - Badges on recommended add-ons
   - Helpful reasons explaining each recommendation

## 📋 How It Works

### Automatic Recommendations Based On:

#### 1️⃣ **Group Size**

- **When**: `persons > 3`
- **Recommends**:
  - Additional Camera
  - Additional Microphone
- **Badge**: "Recommended for groups of 4+"

#### 2️⃣ **Package Type**

- **Reel Package**: Hides "Standard Reel Edit" (already included)
- **First/Basic Package**: Recommends "Episode Edit"

#### 3️⃣ **Universal**

- **Always recommends**: Subtitles
- **Badge**: "Recommended for all bookings"

## 🎯 Business Impact

### Benefits:

- ✅ **Increased Revenue**: Users discover relevant add-ons they might miss
- ✅ **Better Experience**: Customers get what they actually need
- ✅ **Reduced Support**: Fewer "I didn't know that existed" inquiries
- ✅ **Package Value**: Shows what's already included (builds trust)

### Expected Results:

- 📈 20-40% increase in add-on selection rate
- 🎯 Higher customer satisfaction scores
- 💰 Improved average booking value

## 🎨 Visual Guide

### Before (No Recommendations):

```
All Add-ons (Mixed order)
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Subtitle     │ │ Camera       │ │ Episode Edit │
└──────────────┘ └──────────────┘ └──────────────┘
```

### After (With Recommendations):

```
✓ Standard Reel Edit included in your package

⭐ Recommended for You
┌──────────────────────────────┐ ┌──────────────────────────────┐
│ Additional Camera            │ │ Subtitles                    │
│ 🏷️ Recommended for groups 4+ │ │ 🏷️ Recommended for all       │
│ 💡 Capture multiple angles   │ │ 💡 Increase accessibility    │
│ 💰 500 EGP                   │ │ 💰 200 EGP                   │
│ [Add to Cart]                │ │ [Add to Cart]                │
└──────────────────────────────┘ └──────────────────────────────┘

📦 Other Add-ons
┌──────────────┐ ┌──────────────┐
│ Microphone   │ │ Lighting     │
└──────────────┘ └──────────────┘
```

## 🔧 Customization Options

### Option 1: Adjust Existing Rules

Edit `client/src/hooks/use-addon-recommendations.js`:

```javascript
// Change group size threshold
if (numberOfPersons > 3) {
  // Change to > 2, > 4, etc.
  // recommendations...
}
```

### Option 2: Add New Package Rules

```javascript
// Recommend lighting for video packages
if (packageName.toLowerCase().includes("video")) {
  if (addonNameEn.includes("lighting")) {
    recommendation.isRecommended = true;
    recommendation.badge = t("addon-badge-video-essential");
    // ...
  }
}
```

### Option 3: Adjust Priorities

Higher priority = shown first in recommendations (0-10 scale)

```javascript
recommendation.priority = 5; // Very important
recommendation.priority = 1; // Less important
```

## 📊 Monitoring & Analytics

### Key Metrics to Track:

1. **Add-on Selection Rate**
   - Before: X% of bookings include add-ons
   - After: Y% (target: +20-40%)

2. **Recommended Add-on Conversion**
   - Track how many recommended add-ons are selected
   - Identify which recommendations perform best

3. **Average Booking Value**
   - Monitor increase in total booking value
   - Calculate ROI of recommendation system

### Analytics Implementation (Future):

```javascript
// Track when users add a recommended add-on
tracking("add-recommended-addon", {
  addon_name: addon.name,
  reason: recommendation.reason,
  badge: recommendation.badge,
});
```

## 🐛 Troubleshooting

### Issue: No recommendations showing

**Check:**

1. ✅ Migration script was run successfully
2. ✅ Booking has `persons` field set
3. ✅ Package is selected
4. ✅ Browser console for errors

**Solution:**

```bash
# Re-run migration
cd server
node src/scripts/migrate-addon-recommendations.js migrate
```

### Issue: Wrong add-ons recommended

**Check:**

1. ✅ Add-on naming is consistent
2. ✅ Package names match the patterns

**Solution:** Update recommendation logic in the hook to match your exact add-on names

### Issue: Translations missing

**Check:**

1. ✅ Translation keys exist in `client/i18n/messages/en.json`
2. ✅ Translation keys exist in `client/i18n/messages/ar.json`

**Solution:** Add missing keys following the pattern in the files

## 🔒 Rollback (If Needed)

If you need to remove the recommendation system:

```bash
# Remove database metadata
cd server
node src/scripts/migrate-addon-recommendations.js rollback

# Revert code changes (if using git)
git checkout main -- client/src/hooks/use-addon-recommendations.js
git checkout main -- client/src/features/booking/_components/steps/select-additional-services/_components/select-addons.jsx
```

## 📞 Support

For issues or questions:

1. Check the full documentation: `ADDON_RECOMMENDATION_SYSTEM.md`
2. Review the code comments in key files
3. Contact the development team

## ✨ Next Steps

1. ✅ Run the migration script
2. 🧪 Test with different booking scenarios
3. 📊 Monitor add-on selection rates
4. 🎨 Customize recommendations for your business
5. 📈 Track and optimize based on data

## 🎉 Success Criteria

Your recommendation system is working when:

- ✅ Users see "Recommended for You" section
- ✅ Badges appear on appropriate add-ons
- ✅ Reasons explain why items are recommended
- ✅ Package-included items show green notification
- ✅ Add-on selection rate increases

---

**Last Updated**: February 5, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
