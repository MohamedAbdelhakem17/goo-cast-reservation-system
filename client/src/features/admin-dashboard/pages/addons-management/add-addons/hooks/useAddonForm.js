import { useAddNewAddon, useEditAddons } from "@/apis/admin/manage-addons.api";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { addonsValidationSchema, initialAddonValues } from "@/utils/schemas/addon.schema";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { extractPackageIds } from "../addon-form.utils";

/**
 * Custom hook to manage addon form state and submission
 * @param {boolean} isEdit - Whether in edit mode
 * @param {Object} singleAddon - Single addon data for editing
 * @param {Function} t - Translation function
 * @returns {Object} Form instance and loading state
 */
export const useAddonForm = (isEdit, singleAddon, t) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Mutations
  const { isPending: isAdding, addAddon } = useAddNewAddon();
  const { isPending: isUpdating, editAddons } = useEditAddons();

  /**
   * Handle addon submission (both add and edit)
   */
  const handleSubmit = (values) => {
    const mutation = isEdit ? editAddons : addAddon;
    const payload = isEdit ? { payload: values, id: singleAddon?.data?._id } : values;

    console.log("Submitting Addon with values:", values);

    const successMessage = isEdit
      ? t("addon-updated-successfully")
      : t("addon-added-successfully");

    mutation(payload, {
      onSuccess: (response) => {
        addToast(response.message || successMessage, "success");
        queryClient.invalidateQueries("addons");
        setTimeout(() => navigate("/admin-dashboard/addons"), 2000);
      },
      onError: (error) => {
        addToast(error.response?.data?.message || t("something-went-wrong"), "error");
      },
    });
  };

  // Initialize Formik
  const form = useFormik({
    initialValues: initialAddonValues,
    validationSchema: addonsValidationSchema(isEdit),
    onSubmit: handleSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Populate form values when editing
  useEffect(() => {
    if (isEdit && singleAddon?.data) {
      const data = singleAddon.data;

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

  return {
    form,
    isLoading: isEdit ? isUpdating : isAdding,
  };
};
