import {
  useAddNewAddon,
  useEditAddons,
  useGetSingleAddon,
} from "@/apis/admin/manage-addons.api";
import { useGetAllPackages } from "@/apis/admin/manage-package.api";
import {
  Button,
  ErrorFeedback,
  Input,
  OptimizedImage,
  TextArea,
} from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { addonsValidationSchema, initialAddonValues } from "@/utils/schemas/addon.schema";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";

export default function AddAddons() {
  const { t, lng } = useLocalization();
  const [searchParams] = useSearchParams();
  const addonId = searchParams.get("edit");
  const isEdit = Boolean(addonId);
  const navigate = useNavigate();

  // Query
  const { singleAddon } = useGetSingleAddon(addonId);
  const { packages } = useGetAllPackages("all");
  const queryClient = useQueryClient();

  // Prepare package options for react-select
  const packageOptions = useMemo(() => {
    if (!packages?.data) return [];
    return packages.data.map((pkg) => ({
      value: pkg._id,
      label: pkg.name?.[lng] || pkg.name?.en || pkg.name?.ar || pkg._id,
      name: pkg.name,
    }));
  }, [packages, lng]);

  // Mutations
  const { isPending, addAddon } = useAddNewAddon();
  const { isPending: isUpdating, editAddons } = useEditAddons();

  const { addToast } = useToast();

  // Formik
  const form = useFormik({
    initialValues: initialAddonValues,
    validationSchema: addonsValidationSchema(isEdit),
    onSubmit: (values) => {
      isEdit ? handelEditAddon(values) : handelAddAddon(values);
    },
  });

  // Image URL memo
  const imageUrl = useMemo(() => {
    const url = new Map();
    if (form.values.image instanceof File) {
      url.set("image", URL.createObjectURL(form.values.image));
    }
    return url;
  }, [form.values.image]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setFieldValue("image", file);
    }
  };

  // Submit Handlers
  const handelEditAddon = (values) => {
    editAddons(
      { payload: values, id: singleAddon?.data?._id },
      {
        onSuccess: (response) => {
          addToast(response.message || t("addon-updated-successfully"), "success");
          queryClient.invalidateQueries("addons");

          setTimeout(() => navigate("/admin-dashboard/addons"), 2000);
        },
        onError: (error) => {
          addToast(error.response?.data?.message || t("something-went-wrong"), "error");
        },
      },
    );
  };

  const handelAddAddon = (values) => {
    addAddon(values, {
      onSuccess: (response) => {
        addToast(response.message || t("addon-added-successfully"), "success");
        queryClient.invalidateQueries("addons");

        setTimeout(() => navigate("/admin-dashboard/addons"), 2000);
      },
      onError: (error) => {
        addToast(error.response?.data?.message || t("something-went-wrong"), "error");
      },
    });
  };

  const currentLoading = isEdit ? isUpdating : isPending;

  // Set form values if editing
  useEffect(() => {
    if (isEdit && singleAddon?.data) {
      const data = singleAddon.data;

      // Extract package IDs from populated objects or use strings as-is
      const extractPackageIds = (packages) => {
        if (!packages || !Array.isArray(packages)) return [];
        return packages.map((pkg) => {
          // If populated, pkg will be an object with _id
          // If not populated, pkg will be a string ID
          return typeof pkg === "object" ? pkg._id : pkg;
        });
      };

      form.setValues({
        name: {
          ar: data?.name?.ar || "",
          en: data?.name?.en || "",
        },
        description: {
          ar: data?.description?.ar || "",
          en: data?.description?.en || "",
        },
        image: data?.image || "",
        is_active: data?.is_active ?? true,
        price: data?.price || null,
        category: data?.category || "other",
        tags: data?.tags || [],
        recommendation_rules: {
          min_persons: data?.recommendation_rules?.min_persons || null,
          max_persons: data?.recommendation_rules?.max_persons || null,
          recommended_for_packages: extractPackageIds(
            data?.recommendation_rules?.recommended_for_packages,
          ),
          excluded_from_packages: extractPackageIds(
            data?.recommendation_rules?.excluded_from_packages,
          ),
          is_universal_recommendation:
            data?.recommendation_rules?.is_universal_recommendation || false,
          priority: data?.recommendation_rules?.priority || 0,
        },
      });
    }
  }, [isEdit, singleAddon?.data]);

  // Clean up object URLs
  useEffect(() => {
    const url = imageUrl.get("image");
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [imageUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ms:p-8 container mx-auto scale-[.95]"
    >
      <>
        <h2 className="border-main mb-4 rounded-md border-b py-2 text-center text-3xl font-bold text-gray-800">
          {isEdit ? t("edit-addon") : t("add-new-addons")}
        </h2>

        <form
          onSubmit={form.handleSubmit}
          className="grid gap-6 rounded-md bg-white px-4 py-8 shadow md:grid-cols-2"
        >
          {/* Name Fields */}
          <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label={t("addon-arabic-name")}
              id="name.ar"
              name="name.ar"
              value={form.values.name.ar}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              errors={form.touched.name?.ar && form.errors.name?.ar}
              placeholder={t("enter-arabic-name")}
              className="font-arabic"
            />
            <Input
              label={t("addon-english-name")}
              id="name.en"
              name="name.en"
              value={form.values.name.en}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              errors={form.touched.name?.en && form.errors.name?.en}
              placeholder={t("enter-english-name")}
            />
          </div>

          {/* Description Fields */}
          <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextArea
              label={t("arabic-description")}
              id="description.ar"
              name="description.ar"
              value={form.values.description.ar}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              errors={form.touched.description?.ar && form.errors.description?.ar}
              placeholder={t("enter-arabic-description")}
              className="font-arabic rtl text-right"
              rows={4}
            />
            <TextArea
              label={t("english-description")}
              id="description.en"
              name="description.en"
              value={form.values.description.en}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              errors={form.touched.description?.en && form.errors.description?.en}
              placeholder={t("enter-english-description")}
              rows={4}
            />
          </div>

          {/* Price */}
          <div className="col-span-2">
            <Input
              label={t("price")}
              id="price"
              name="price"
              type="number"
              value={form.values.price}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              errors={form.touched.price && form.errors.price}
              placeholder={t("enter-price")}
            />
          </div>

          {/* Image Upload */}
          <div className="col-span-2">
            <label className="mb-2 block font-semibold">{t("thumbnail")}</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="w-full rounded-md border border-gray-300 p-2"
              onChange={handleImageUpload}
              onBlur={form.handleBlur}
            />
            {form.touched.image && form.errors.image && (
              <ErrorFeedback>{form.errors.image}</ErrorFeedback>
            )}
            {form.values.image && (
              <OptimizedImage
                src={
                  form.values.image instanceof File
                    ? imageUrl.get("image")
                    : form.values.image
                }
                alt="Thumbnail"
                className="mt-2 h-32 w-32 rounded object-cover"
              />
            )}
          </div>

          {/* Active Checkbox */}
          <div className="col-span-2">
            <label className="flex items-center gap-4">
              <input
                type="checkbox"
                name="is_active"
                checked={form.values.is_active}
                onChange={(e) => form.setFieldValue("is_active", e.target.checked)}
              />
              <span className="text-gray-700">{t("is-active")}</span>
            </label>
          </div>

          {/* Recommendation Settings Section */}
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
                  const tags = e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean);
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
                  const value = e.target.value === "" ? null : parseInt(e.target.value);
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
                  const value = e.target.value === "" ? null : parseInt(e.target.value);
                  form.setFieldValue("recommendation_rules.max_persons", value);
                }}
                placeholder={t("e-g-10")}
              />
            </div>

            {/* Package Rules */}
            <div className="mb-4">
              <label className="mb-2 block font-semibold">
                {t("recommended-for-packages")}
              </label>
              <Select
                isMulti
                options={packageOptions}
                value={packageOptions.filter((opt) =>
                  form.values.recommendation_rules.recommended_for_packages.includes(
                    opt.value,
                  ),
                )}
                onChange={(selected) => {
                  const packageIds = selected ? selected.map((opt) => opt.value) : [];
                  form.setFieldValue(
                    "recommendation_rules.recommended_for_packages",
                    packageIds,
                  );
                }}
                placeholder={t("select-packages")}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "44px",
                    borderColor: "#e5e7eb",
                    borderRadius: "0.375rem",
                  }),
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("recommended-packages-help-text")}
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">
                {t("excluded-from-packages")}
              </label>
              <Select
                isMulti
                options={packageOptions}
                value={packageOptions.filter((opt) =>
                  form.values.recommendation_rules.excluded_from_packages.includes(
                    opt.value,
                  ),
                )}
                onChange={(selected) => {
                  const packageIds = selected ? selected.map((opt) => opt.value) : [];
                  form.setFieldValue(
                    "recommendation_rules.excluded_from_packages",
                    packageIds,
                  );
                }}
                placeholder={t("select-packages")}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "44px",
                    borderColor: "#e5e7eb",
                    borderRadius: "0.375rem",
                  }),
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("excluded-packages-help-text")}
              </p>
            </div>

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
                  const value = Math.min(10, Math.max(0, parseInt(e.target.value) || 0));
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

          {/* Submit */}
          <div className="col-span-2">
            <Button isPending={currentLoading} fallback={t("processing-0")}>
              {isEdit ? t("update-addon") : t("add-addon")}
            </Button>
          </div>
        </form>
      </>
    </motion.div>
  );
}
