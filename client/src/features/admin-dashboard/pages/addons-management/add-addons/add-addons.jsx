import {
  useAddNewAddon,
  useEditAddons,
  useGetSingleAddon,
} from "@/apis/admin/manage-addons.api";
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

export default function AddAddons() {
  const { t } = useLocalization();
  const [searchParams] = useSearchParams();
  const addonId = searchParams.get("edit");
  const isEdit = Boolean(addonId);
  const navigate = useNavigate();

  // Query
  const { singleAddon } = useGetSingleAddon(addonId);
  const queryClient = useQueryClient();

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
