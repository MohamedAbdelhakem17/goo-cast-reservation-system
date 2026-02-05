import { Input } from "@/components/common";
import { clamp, parseNumberOrNull, parseTagsFromString } from "../addon-form.utils";
import { PackageSelector } from "./PackageSelector";

/**
 * Recommendation settings section component
 */
export const RecommendationSettings = ({ form, packageOptions, t }) => {
  return (
    <div className="col-span-2 mt-6 rounded-lg border border-gray-200 p-6">
      <h3 className="mb-4 text-xl font-semibold text-gray-800">
        {t("recommendation-settings")}
      </h3>

      {/* Category */}
      <div className="mb-4">
        <label className="mb-2 block font-semibold">{t("category")}</label>
        <select
          name="category"
          value={form.values.category}
          onChange={form.handleChange}
          className="w-full rounded-md border border-gray-300 p-2"
        >
          <option value="other">{t("other")}</option>
          <option value="equipment">{t("equipment")}</option>
          <option value="editing">{t("editing")}</option>
          <option value="production">{t("production")}</option>
          <option value="accessibility">{t("accessibility")}</option>
        </select>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="mb-2 block font-semibold">{t("tags")}</label>
        <Input
          placeholder={t("enter-tags-comma-separated")}
          value={form.values.tags.join(", ")}
          onChange={(e) => {
            const tags = parseTagsFromString(e.target.value);
            form.setFieldValue("tags", tags);
          }}
        />
        <p className="mt-1 text-xs text-gray-500">{t("tags-help-text")}</p>
      </div>

      {/* Group Size Rules */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label={t("min-persons-to-recommend")}
          type="number"
          name="recommendation_rules.min_persons"
          value={form.values.recommendation_rules.min_persons || ""}
          onChange={(e) => {
            const value = parseNumberOrNull(e.target.value);
            form.setFieldValue("recommendation_rules.min_persons", value);
          }}
          placeholder={t("e-g-4")}
        />
        <Input
          label={t("max-persons-to-recommend")}
          type="number"
          name="recommendation_rules.max_persons"
          value={form.values.recommendation_rules.max_persons || ""}
          onChange={(e) => {
            const value = parseNumberOrNull(e.target.value);
            form.setFieldValue("recommendation_rules.max_persons", value);
          }}
          placeholder={t("e-g-10")}
        />
      </div>

      {/* Recommended For Packages */}
      <PackageSelector
        label={t("recommended-for-packages")}
        options={packageOptions}
        selectedValues={form.values.recommendation_rules.recommended_for_packages}
        onChange={(packageIds) =>
          form.setFieldValue("recommendation_rules.recommended_for_packages", packageIds)
        }
        placeholder={t("select-packages")}
        helpText={t("recommended-packages-help-text")}
      />

      {/* Excluded From Packages */}
      <PackageSelector
        label={t("excluded-from-packages")}
        options={packageOptions}
        selectedValues={form.values.recommendation_rules.excluded_from_packages}
        onChange={(packageIds) =>
          form.setFieldValue("recommendation_rules.excluded_from_packages", packageIds)
        }
        placeholder={t("select-packages")}
        helpText={t("excluded-packages-help-text")}
      />

      {/* Universal Recommendation */}
      <div className="mb-4">
        <label className="flex items-center gap-4">
          <input
            type="checkbox"
            name="recommendation_rules.is_universal_recommendation"
            checked={form.values.recommendation_rules.is_universal_recommendation}
            onChange={(e) =>
              form.setFieldValue(
                "recommendation_rules.is_universal_recommendation",
                e.target.checked,
              )
            }
          />
          <span className="text-gray-700">{t("universal-recommendation")}</span>
        </label>
        <p className="mt-1 ml-8 text-xs text-gray-500">
          {t("universal-recommendation-help")}
        </p>
      </div>

      {/* Priority */}
      <div>
        <Input
          label={t("priority")}
          type="number"
          name="recommendation_rules.priority"
          value={form.values.recommendation_rules.priority}
          onChange={(e) => {
            const value = clamp(parseInt(e.target.value), 0, 10);
            form.setFieldValue("recommendation_rules.priority", value);
          }}
          min="0"
          max="10"
          errors={
            form.touched.recommendation_rules?.priority &&
            form.errors.recommendation_rules?.priority
          }
        />
        <p className="mt-1 text-xs text-gray-500">{t("priority-help-text")}</p>
      </div>
    </div>
  );
};
