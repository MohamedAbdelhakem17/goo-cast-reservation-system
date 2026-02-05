# Admin Dashboard - Add-on Recommendation Management Guide

## 🎯 Overview

You can now manage add-on recommendations directly from the admin dashboard without editing code! This guide shows you how to configure intelligent recommendations for your add-ons.

## 📍 Location

Navigate to: **Admin Dashboard → Add-ons → Add New Add-on** (or Edit existing)

## 🛠️ Recommendation Settings

### Section: Recommendation Settings

At the bottom of the add-on form, you'll find the "Recommendation Settings" section with the following fields:

---

### 1️⃣ **Category**

**What it does**: Categorizes your add-on for better organization and targeted recommendations.

**Options**:

- **Equipment** - Cameras, microphones, lighting
- **Editing** - Post-production services (episode edit, reel edit, etc.)
- **Production** - Production-related services
- **Accessibility** - Subtitles, captions, translations
- **Other** - Everything else

**Example**: Set "Additional Camera" to "Equipment"

---

### 2️⃣ **Tags**

**What it does**: Adds searchable keywords to your add-on.

**Format**: Comma-separated list

- Example: `camera, video, recording`
- Example: `subtitle, accessibility, caption`

**Use case**: Future search and filtering functionality

---

### 3️⃣ **Min Persons to Recommend**

**What it does**: Automatically recommends this add-on when the booking has **at least** this many persons.

**Example**:

- Set to `4` for "Additional Camera"
- When user books for 4+ people, this add-on appears in "Recommended for You"

**Badge shown**: "Recommended for groups of 4+"

---

### 4️⃣ **Max Persons to Recommend**

**What it does**: Only recommends this add-on when booking has **up to** this many persons.

**Example**:

- Set to `2` for "Single Person Mic"
- Only recommended for bookings with 1-2 people

---

### 5️⃣ **Recommended for Packages**

**What it does**: Shows this add-on as recommended when specific packages are selected.

**Format**: Comma-separated package names

- Example: `First Package, Basic Package`
- Example: `Reel Package, Video Package`

**Badge shown**: "Popular upgrade"

**Note**: Match must be case-insensitive substring (e.g., "first" matches "First Package")

---

### 6️⃣ **Excluded from Packages**

**What it does**: **Hides** this add-on when specific packages are selected (because it's already included).

**Format**: Comma-separated package names

- Example: `Reel Package` (for Standard Reel Edit add-on)
- Example: `Premium Package` (for any add-on included in premium)

**Result**: Green notification shows "✓ [Add-on name] included in your package"

---

### 7️⃣ **Always Recommend (Universal)**

**What it does**: This add-on is recommended for **all bookings**, regardless of group size or package.

**Checkbox**: ✅ Check to enable

**Example**: Subtitles should always be recommended

**Badge shown**: "Recommended for all bookings"

---

### 8️⃣ **Priority (0-10)**

**What it does**: Controls the **order** of recommended add-ons. Higher priority = shown first.

**Scale**:

- **0** - Lowest priority (shown last)
- **5** - Medium priority
- **10** - Highest priority (shown first)

**Example**:

- Camera: Priority 3
- Microphone: Priority 3
- Episode Edit: Priority 2
- Subtitles: Priority 1

**Display order**: Camera & Microphone → Episode Edit → Subtitles

---

## 📋 Real-World Examples

### Example 1: Additional Camera

```
Category: Equipment
Tags: camera, video, recording
Min Persons: 4
Max Persons: (leave empty)
Recommended for Packages: (leave empty)
Excluded from Packages: (leave empty)
Always Recommend: ❌ No
Priority: 3
```

**Result**: Recommended for bookings with 4+ people with high priority

---

### Example 2: Subtitles

```
Category: Accessibility
Tags: subtitle, caption, accessibility
Min Persons: (leave empty)
Max Persons: (leave empty)
Recommended for Packages: (leave empty)
Excluded from Packages: (leave empty)
Always Recommend: ✅ Yes
Priority: 1
```

**Result**: Always recommended for all bookings

---

### Example 3: Episode Edit

```
Category: Editing
Tags: editing, episode, post-production
Min Persons: (leave empty)
Max Persons: (leave empty)
Recommended for Packages: First Package, Basic Package
Excluded from Packages: (leave empty)
Always Recommend: ❌ No
Priority: 2
```

**Result**: Recommended when "First Package" or "Basic Package" is selected

---

### Example 4: Standard Reel Edit

```
Category: Editing
Tags: reel, editing, short-form
Min Persons: (leave empty)
Max Persons: (leave empty)
Recommended for Packages: (leave empty)
Excluded from Packages: Reel Package
Always Recommend: ❌ No
Priority: 0
```

**Result**: Hidden when "Reel Package" is selected (because it's included)

---

## 🎨 How Recommendations Appear to Users

### User Journey:

1. User selects **5 persons** and **First Package**
2. Navigates to "Additional Services" step
3. Sees:

```
✓ Standard Reel Edit included in your package

⭐ Recommended for You
┌────────────────────────────┐ ┌────────────────────────────┐
│ Additional Camera          │ │ Additional Microphone      │
│ 🏷️ Recommended for groups 4+│ │ 🏷️ Recommended for groups 4+│
│ 💡 Capture multiple angles │ │ 💡 Ensure clear audio      │
│ 500 EGP                    │ │ 300 EGP                    │
└────────────────────────────┘ └────────────────────────────┘

┌────────────────────────────┐ ┌────────────────────────────┐
│ Episode Edit               │ │ Subtitles                  │
│ 🏷️ Popular upgrade         │ │ 🏷️ Recommended for all     │
│ 💡 Enhance your package    │ │ 💡 Increase accessibility  │
│ 1000 EGP                   │ │ 200 EGP                    │
└────────────────────────────┘ └────────────────────────────┘

📦 Other Add-ons
(Non-recommended add-ons appear here)
```

---

## ✅ Best Practices

### DO:

- ✅ Set meaningful categories for all add-ons
- ✅ Use universal recommendation sparingly (only for truly universal items)
- ✅ Set appropriate priorities (higher for more important add-ons)
- ✅ Use "Excluded from Packages" to hide duplicate add-ons
- ✅ Test different scenarios after configuring

### DON'T:

- ❌ Set too many add-ons as universal (dilutes recommendations)
- ❌ Use exact package names (use partial matches like "first" instead of "The First Package")
- ❌ Set conflicting rules (e.g., both recommend AND exclude for same package)
- ❌ Forget to test the user-facing side

---

## 🧪 Testing Your Configuration

After configuring recommendations:

1. **Go to booking page** (not admin dashboard)
2. **Select different group sizes** (1, 3, 5, 10 people)
3. **Select different packages** (First, Reel, Premium, etc.)
4. **Navigate to Additional Services step**
5. **Verify**:
   - Correct add-ons are recommended
   - Badges display correctly
   - Reasons make sense
   - Excluded add-ons are hidden with notification
   - Order follows priority

---

## 📊 Recommendation Priority

The system uses **both** database rules and code-based fallbacks:

### Priority Order:

1. **Database rules** (what you set in admin dashboard) - Checked first
2. **Code-based fallback** - Used if no database rules match

This means:

- ✅ Your admin dashboard settings always take precedence
- ✅ System still works even for old add-ons without database rules
- ✅ Best of both worlds: flexibility + backwards compatibility

---

## 🔄 Updating Existing Add-ons

To add recommendations to existing add-ons:

1. Go to **Admin Dashboard → Add-ons**
2. Find the add-on you want to update
3. Click **Edit** button
4. Scroll to **Recommendation Settings** section
5. Configure the fields
6. Click **Update Add-on**

**Note**: Changes take effect immediately (no page refresh needed for users)

---

## 🎯 Common Scenarios

### Scenario 1: Recommend for Large Groups

**Need**: Camera/Mic for 4+ people

**Settings**:

- Min Persons: `4`
- Priority: `3`

---

### Scenario 2: Upsell to Basic Package Users

**Need**: Suggest Episode Edit to First Package buyers

**Settings**:

- Recommended for Packages: `First Package, Basic`
- Category: `Editing`
- Priority: `2`

---

### Scenario 3: Always Show Subtitles

**Need**: Recommend subtitles to everyone

**Settings**:

- Always Recommend: ✅ Yes
- Priority: `1`

---

### Scenario 4: Hide What's Included

**Need**: Don't show Reel Edit if Reel Package selected

**Settings**:

- Excluded from Packages: `Reel Package`

---

## 💡 Tips & Tricks

1. **Use Partial Package Names**: Instead of exact match, use keywords
   - ✅ Good: `first`, `basic`, `reel`
   - ❌ Avoid: `The First Package (Original)`

2. **Priority Guidelines**:
   - `1-2`: Nice to have
   - `3-5`: Recommended
   - `6-8`: Highly recommended
   - `9-10`: Critical/Essential

3. **Category Benefits**:
   - Better organization in reports
   - Future filtering capabilities
   - Helps auto-generate reasons

4. **Tag Strategically**:
   - Use common search terms
   - Include both English and Arabic keywords
   - Think about how users search

---

## 🚨 Troubleshooting

### Issue: Recommendations not showing

**Check**:

- ✅ Add-on is marked as "Active"
- ✅ Rules are configured correctly
- ✅ Test with correct conditions (e.g., right number of persons)

### Issue: Wrong add-on hidden

**Check**:

- ✅ "Excluded from Packages" field
- ✅ Package name matching (partial match)

### Issue: Priority not working

**Check**:

- ✅ Multiple add-ons have different priorities
- ✅ Clear browser cache
- ✅ Recommendation rules are saved

---

## 📞 Support

For questions or issues:

1. Check the full technical documentation: `ADDON_RECOMMENDATION_SYSTEM.md`
2. Review examples in this guide
3. Test in a staging environment first
4. Contact technical support if issues persist

---

**Version**: 1.0.0  
**Last Updated**: February 5, 2026  
**Status**: ✅ Production Ready
