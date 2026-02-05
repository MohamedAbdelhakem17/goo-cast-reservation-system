# Package Reference Update for Add-on Recommendations

## Overview

Updated the add-on recommendation system to use database references (ObjectIds) for packages instead of text strings. This provides more reliable matching and better data integrity.

## Changes Made

### 1. Backend Updates

#### Database Schema (`server/src/models/add-on-model/add-on-model.js`)

- Changed `recommended_for_packages` from `[String]` to `[{ type: mongoose.Schema.Types.ObjectId, ref: "HourlyPackage" }]`
- Changed `excluded_from_packages` from `[String]` to `[{ type: mongoose.Schema.Types.ObjectId, ref: "HourlyPackage" }]`
- Updated comments to reflect they now store package IDs instead of slugs/names

#### Controller Updates (`server/src/api/v1/controller/add-on-controller/add-on-controller.js`)

- **getAllAddOns**: Added `.populate()` calls to populate package names for both fields
- **getAddOnById**: Added `.populate()` calls to populate package details when fetching single add-on
- **updateAddOn**: Added parsing logic for `recommendation_rules` and `tags` when they come as JSON strings

### 2. Frontend Updates

#### Admin Form (`client/src/features/admin-dashboard/pages/addons-management/add-addons/add-addons.jsx`)

- **Import**: Added `react-select` and `useGetAllPackages` hook
- **Package Options**: Created `packageOptions` using `useMemo` to map packages to react-select format
- **Form Fields**: Converted both package input fields to multi-select dropdowns:
  - `recommended_for_packages`: Multi-select with package options
  - `excluded_from_packages`: Multi-select with package options
- **Edit Mode**: Added `extractPackageIds()` function to handle both populated objects and string IDs
- **Styling**: Added custom styles for the Select components to match the design system

#### Translation Files

- **en.json**:
  - Added `"select-packages": "Select packages..."`
  - Updated `"recommended-packages-help-text"` to be more descriptive
- **ar.json**:
  - Added `"select-packages": "اختر الباقات..."`
  - Updated `"recommended-packages-help-text"` with Arabic translation

#### Recommendation Hook (`client/src/hooks/use-addon-recommendations.js`)

- Added `packageId` extraction from `bookingData.selectedPackage`
- **Excluded Packages Rule**: Updated to check by package ID first, then fallback to text matching
- **Recommended Packages Rule**: Updated to check by package ID first, then fallback to text matching
- Maintains backward compatibility with text-based matching for existing data

#### Utility Update (`client/src/utils/append-fom-data.js`)

- Added special handling for `recommendation_rules` and `tags` fields
- These fields are now stringified before appending to FormData
- Ensures proper backend parsing of complex nested structures

## Benefits

1. **Data Integrity**: Using ObjectIds ensures referential integrity and prevents typos
2. **Better UX**: Multi-select dropdown is more user-friendly than comma-separated text
3. **Reliable Matching**: ID-based matching is exact and doesn't suffer from case sensitivity issues
4. **Edit Mode**: Properly loads selected packages when editing an add-on
5. **Backward Compatible**: Falls back to text matching for existing data

## Usage

### Creating/Editing Add-ons (Admin Dashboard)

1. Navigate to Add-ons Management
2. Click "Add New Add-on" or edit an existing one
3. Scroll to "Recommendation Settings" section
4. Use the multi-select dropdowns to select packages:
   - **Recommended for Packages**: Packages this add-on should be recommended for
   - **Excluded from Packages**: Packages this add-on should be hidden for
5. Selected packages are saved as ObjectId references in the database

### How It Works (Booking Flow)

1. When a user selects a package during booking, the system extracts the package ID
2. The recommendation hook checks if the package ID exists in `recommended_for_packages` or `excluded_from_packages`
3. Add-ons are categorized as:
   - **Recommended**: Shows with badges and reasons
   - **Hidden**: Not displayed (excluded from package)
   - **Regular**: Available but not highlighted

## Testing Checklist

- [ ] Create a new add-on with package recommendations
- [ ] Edit an existing add-on and verify packages load correctly
- [ ] Verify multi-select shows package names in current language
- [ ] Test booking flow with recommended add-ons
- [ ] Test booking flow with excluded add-ons
- [ ] Verify backward compatibility with text-based rules
- [ ] Check that edit mode populates selected packages
- [ ] Test form validation for recommendation fields

## Migration Notes

Existing add-ons with text-based package references will continue to work due to the fallback logic in the recommendation hook. However, to take full advantage of the new system:

1. Edit each add-on in the admin dashboard
2. Re-select packages using the new multi-select dropdown
3. Save to update to ObjectId references

No data migration script is required as the system handles both formats gracefully.
