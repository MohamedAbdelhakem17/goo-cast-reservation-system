import { useMemo } from "react";

/**
 * Hook to generate intelligent add-on recommendations based on booking context
 * @param {Object} params
 * @param {Array} params.addons - All available add-ons
 * @param {Object} params.bookingData - Current booking data
 * @param {Function} params.t - Translation function
 * @param {string} params.lng - Current language
 * @returns {Object} - Recommended and non-recommended add-ons with metadata
 */
export const useAddonRecommendations = ({ addons, bookingData, t, lng }) => {
  const recommendations = useMemo(() => {
    if (!addons?.data || !bookingData) {
      return { recommended: [], regular: [] };
    }

    const numberOfPersons = bookingData.persons || 0;
    const selectedPackage = bookingData.selectedPackage || {};
    const packageName = selectedPackage?.name?.[lng] || selectedPackage?.name || "";
    const packageId = selectedPackage?._id || selectedPackage?.id || null;

    // Create recommendation rules
    const recommendationRules = addons.data.map((addon) => {
      const addonNameEn = addon.name?.en?.toLowerCase() || "";
      const addonNameAr = addon.name?.ar || "";

      let recommendation = {
        addon,
        isRecommended: false,
        reason: null,
        badge: null,
        priority: addon.recommendation_rules?.priority || 0,
        isDisabled: false,
        disabledReason: null,
      };

      // Check database-driven rules first
      const dbRules = addon.recommendation_rules;

      // Rule: Excluded from packages (Disable)
      if (dbRules?.excluded_from_packages?.length > 0) {
        // First check by package ID (database-driven)
        const isExcludedById =
          packageId &&
          dbRules.excluded_from_packages.some((pkg) => {
            // Handle both populated objects and string IDs
            const pkgId = typeof pkg === "object" ? pkg._id : pkg;
            return pkgId === packageId || pkgId?.toString() === packageId?.toString();
          });

        // Fallback to text matching for backward compatibility
        const isExcludedByName =
          !packageId &&
          dbRules.excluded_from_packages.some((pkg) => {
            const pkgName =
              typeof pkg === "object" ? pkg.name?.[lng] || pkg.name?.en : pkg;
            return packageName.toLowerCase().includes(pkgName?.toLowerCase() || "");
          });

        if (isExcludedById || isExcludedByName) {
          recommendation.isDisabled = true;
          recommendation.disabledReason = t("addon-included-in-package");
          return recommendation; // Return immediately - disabled addons can't be recommended
        }
      }

      // Rule 1: Disable Standard Reel Edit if Reel Package is selected (fallback)
      if (
        (addonNameEn.includes("standard reel edit") ||
          addonNameEn.includes("reel edit")) &&
        packageName.toLowerCase().includes("reel")
      ) {
        recommendation.isDisabled = true;
        recommendation.disabledReason = t("addon-included-in-package");
        return recommendation; // Return immediately - disabled addons can't be recommended
      }

      // Rule: Universal recommendation (database-driven)
      if (dbRules?.is_universal_recommendation) {
        recommendation.isRecommended = true;
        recommendation.reason = t("addon-reason-subtitles");
        recommendation.badge = t("addon-badge-recommended-all");
        recommendation.priority = dbRules.priority || 1;
        return recommendation;
      }

      // Rule: Group size-based (database-driven)
      if (dbRules?.min_persons && numberOfPersons >= dbRules.min_persons) {
        recommendation.isRecommended = true;
        recommendation.badge = t("addon-badge-large-groups");
        recommendation.priority = dbRules.priority || 3;

        // Determine reason based on category
        if (addon.category === "equipment") {
          if (addonNameEn.includes("camera")) {
            recommendation.reason = t("addon-reason-group-camera");
          } else if (addonNameEn.includes("microphone")) {
            recommendation.reason = t("addon-reason-group-microphone");
          } else {
            recommendation.reason = t("addon-reason-group-camera");
          }
        }
        return recommendation;
      }

      // Rule 2: Group Size-Based Recommendations (> 3 persons) - fallback
      if (numberOfPersons > 3 && !dbRules?.min_persons) {
        if (addonNameEn.includes("camera") && addonNameEn.includes("additional")) {
          recommendation.isRecommended = true;
          recommendation.reason = t("addon-reason-group-camera");
          recommendation.badge = t("addon-badge-large-groups");
          recommendation.priority = 3;
          return recommendation;
        }

        if (addonNameEn.includes("microphone") && addonNameEn.includes("additional")) {
          recommendation.isRecommended = true;
          recommendation.reason = t("addon-reason-group-microphone");
          recommendation.badge = t("addon-badge-large-groups");
          recommendation.priority = 3;
          return recommendation;
        }
      }

      // Rule: Recommended for specific packages (database-driven)
      if (dbRules?.recommended_for_packages?.length > 0) {
        // First check by package ID (database-driven)
        const isRecommendedById =
          packageId &&
          dbRules.recommended_for_packages.some((pkg) => {
            // Handle both populated objects and string IDs
            const pkgId = typeof pkg === "object" ? pkg._id : pkg;
            return pkgId === packageId || pkgId?.toString() === packageId?.toString();
          });

        // Fallback to text matching for backward compatibility
        const isRecommendedByName =
          !packageId &&
          dbRules.recommended_for_packages.some((pkg) => {
            const pkgName =
              typeof pkg === "object" ? pkg.name?.[lng] || pkg.name?.en : pkg;
            return packageName.toLowerCase().includes(pkgName?.toLowerCase() || "");
          });

        if (isRecommendedById || isRecommendedByName) {
          recommendation.isRecommended = true;
          recommendation.badge = t("addon-badge-popular-upgrade");
          recommendation.priority = dbRules.priority || 2;

          if (addon.category === "editing") {
            recommendation.reason = t("addon-reason-episode-edit");
          }
          return recommendation;
        }
      }

      // Rule 3: Package-Based Recommendations - fallback
      // First Package (Basic) → Recommend Episode Edit
      if (
        (packageName.toLowerCase().includes("first") ||
          packageName.toLowerCase().includes("basic")) &&
        !dbRules?.recommended_for_packages?.length
      ) {
        if (addonNameEn.includes("episode edit") || addonNameEn.includes("episode")) {
          recommendation.isRecommended = true;
          recommendation.reason = t("addon-reason-episode-edit");
          recommendation.badge = t("addon-badge-popular-upgrade");
          recommendation.priority = 2;
          return recommendation;
        }
      }

      // Rule 4: Universal Recommendations - Subtitles (DISABLED - use database rules only)
      // This fallback rule has been removed. Use is_universal_recommendation in database instead.

      return recommendation;
    });

    // Don't filter out disabled add-ons, just mark them
    // Split into recommended and regular
    const recommended = recommendationRules
      .filter((r) => r.isRecommended)
      .sort((a, b) => b.priority - a.priority); // Sort by priority (high to low)

    const regular = recommendationRules.filter((r) => !r.isRecommended);

    return {
      recommended,
      regular,
      disabledAddons: recommendationRules.filter((r) => r.isDisabled),
    };
  }, [addons, bookingData, t, lng]);

  return recommendations;
};

export default useAddonRecommendations;
