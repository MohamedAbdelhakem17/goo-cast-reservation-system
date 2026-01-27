import { useAddPromotion, useEditPromotion } from "@/apis/admin/manage-promotions.api";
import { Button, ErrorFeedback, Input, TextArea } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import usePromotionSchema from "@/utils/schemas/promotion-schema";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { X } from "lucide-react";
import { useRef } from "react";

export default function AddPromotionsForm({ onClose, mode = "add", initialData = null }) {
  // Translation
  const { t } = useLocalization();

  const FormMode = useRef(mode).current;

  // Mutation
  const { mutate: AddPromotion, isPending, error } = useAddPromotion();
  const {
    mutate: EditPromotion,
    isPending: isEditing,
    error: editError,
  } = useEditPromotion();

  // Hooks
  const { getInitialValues, promotionValidationSchema } = usePromotionSchema();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Function
  const handleAddPromotion = async (values) => {
    await AddPromotion(values, {
      onSuccess: () => {
        // Close the form
        onClose();

        // Show success toast
        addToast(t("promotion-added-successfully"), "success");

        // Refetch  promotions
        queryClient.refetchQueries({ queryKey: ["all-promotions"] });
      },
    });
  };

  const handleEditPromotion = async (values) => {
    await EditPromotion(
      { values, id: initialData._id },
      {
        onSuccess: () => {
          // Close the form
          onClose();

          // Show success toast
          addToast(t("promotion-edited-successfully"), "success");

          // Refetch  promotions
          queryClient.refetchQueries({ queryKey: ["all-promotions"] });
        },
      },
    );
  };

  const handleFormSubmit = async (values) => {
    if (FormMode === "add") {
      await handleAddPromotion(values);
    } else {
      await handleEditPromotion(values);
    }
  };
  // Form and validation
  const form = useFormik({
    initialValues: getInitialValues(initialData),
    validationSchema: promotionValidationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <div className="w-5xl max-w-full p-6">
      {/* Header  */}
      <div className="mb-6 flex items-center justify-between">
        {/* Label */}
        <h2 className="mb-1 text-lg font-bold text-gray-800">
          {FormMode === "add" ? t("add-new-promotion") : t("edit-promotion")}
        </h2>

        {/* icon */}
        <button
          onClick={onClose}
          className="cursor-pointer text-gray-600 transition-colors duration-200 hover:text-gray-800"
          type="button"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={form.handleSubmit}
        className="grid grid-cols-1 gap-x-4 gap-y-7 md:grid-cols-2"
      >
        {/* Title en*/}
        <Input
          id="title-en"
          name="title.en"
          className="col-span-1"
          label={t("title-en")}
          value={form.values.title.en}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errors={form.errors.title?.en}
          touched={form.touched.title?.en}
        />

        {/* Title ar*/}
        <Input
          id="title-ar"
          name="title.ar"
          className="col-span-1"
          label={t("title-ar")}
          value={form.values.title.ar}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errors={form.errors.title?.ar}
          touched={form.touched.title?.ar}
        />

        <TextArea
          id="description-en"
          name="description.en"
          className="col-span-1"
          label={t("description-en")}
          value={form.values.description.en}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errors={form.errors.description?.en}
          touched={form.touched.description?.en}
        />

        <TextArea
          id="description-ar"
          name="description.ar"
          className="col-span-1"
          label={t("description-ar")}
          value={form.values.description.ar}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errors={form.errors.description?.ar}
          touched={form.touched.description?.ar}
        />

        {/* Start Date */}
        <Input
          id="start-date"
          name="start_date"
          type="date"
          className="col-span-1"
          label={t("start-date")}
          value={form.values.start_date}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errors={form.errors.start_date}
          touched={form.touched.start_date}
        />

        {/* End Date */}
        <Input
          id="end-date"
          name="end_date"
          type="date"
          className="col-span-1"
          label={t("end-date")}
          value={form.values.end_date}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errors={form.errors.end_date}
          touched={form.touched.end_date}
        />

        {/* Priority */}
        <Input
          id="priority"
          name="priority"
          type="number"
          className="col-span-1"
          label={t("priority")}
          value={form.values.priority}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          errors={form.errors.priority}
          touched={form.touched.priority}
        />

        {/* Is Enabled */}
        <div className="col-span-1 flex items-center space-x-4 space-x-reverse">
          <input
            id="isEnabled"
            name="isEnabled"
            type="checkbox"
            checked={form.values.isEnabled}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            errors={form.errors.isEnabled}
            touched={form.touched.isEnabled}
          />
          <label
            htmlFor="isEnabled"
            className="ms-2.5 text-base font-medium text-gray-700"
          >
            {t("is-enabled")}
          </label>
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
          <Button isPending={isPending || isEditing}>{t("submit")}</Button>
        </div>

        {/* backend Error  */}
        {(error || editError) && (
          <ErrorFeedback>{(error || editError).message}</ErrorFeedback>
        )}
      </form>
    </div>
  );
}
