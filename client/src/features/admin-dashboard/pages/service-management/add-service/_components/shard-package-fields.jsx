import { useGetAllCategories } from "@/apis/admin/manage-category.api";
import { Input, SelectInput } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useMemo } from "react";

export default function ShardFields({ formik }) {
  const { lng, t } = useLocalization();
  const { categories } = useGetAllCategories();

  const CategoryOptions = categories?.data?.map((category) => ({
    label: category?.name?.[lng],
    value: category?._id,
  }));

  const handleRemoveImage = () => {
    formik.setFieldValue("image", null);
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
    }
  };

  const imageUrls = useMemo(() => {
    const urls = new Map();

    if (formik.values.image instanceof File) {
      urls.set("image", URL.createObjectURL(formik.values.image));
    }

    return urls;
  }, [formik.values.image]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* English Name */}
      <Input
        type="number"
        label={t("package-price")}
        id="price"
        name="price"
        value={formik.values.price}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.price && formik.errors.price}
        placeholder={t("package-price-per-hour")}
        className="col-span-1 md:col-span-2"
      />

      {/*  best_for */}
      <Input
        label={t("enter-best-for")}
        id="best_for"
        name="best_for"
        value={formik.values.best_for}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.best_for && formik.errors.best_for}
        placeholder={t("best-for")}
        className="col-span-1 md:col-span-2"
      />

      {/* Category Select */}
      <SelectInput
        name="category"
        label={t("category")}
        value={formik.values.category}
        onChange={(e) => formik.setFieldValue("category", e.target.value)}
        options={CategoryOptions}
        placeholder={t("select-a-category")}
        className="col-span-1 md:col-span-2"
      />

      {/* Package Type */}
      <SelectInput
        name="package_type"
        label={t("package-type")}
        value={formik.values.package_type}
        onChange={(e) => formik.setFieldValue("package_type", e.target.value)}
        options={["basic", "bundle"].map((type) => ({
          label: type.charAt(0).toUpperCase() + type.slice(1),
          value: type,
        }))}
        placeholder={t("select-package-type")}
        className="col-span-1 md:col-span-2"
      />

      {/*  Actual  Bundle Price */}
      {formik.values.package_type === "bundle" && (
        <Input
          type="number"
          label={t("bundle-actual-price")}
          id="bundle_actual_price"
          name="bundle_actual_price"
          value={formik.values.bundle_actual_price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errors={formik.touched.bundle_actual_price && formik.errors.bundle_actual_price}
          placeholder={t("bundle-actual-price-placeholder")}
          className="col-span-1 md:col-span-2"
        />
      )}
      {/* Image */}
      <div className="col-span-1 md:col-span-2">
        <label className="mb-2 block font-semibold">{t("image")}</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full rounded-md border border-gray-300 p-2"
          name="image"
        />
        {formik.values.image && (
          <div className="mt-2">
            <img
              src={
                formik.values.image instanceof File
                  ? imageUrls.get("image")
                  : formik.values.image
              }
              alt="image"
              className="size-64 rounded object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-1 block text-red-500"
            >
              {t("remove-image")}
            </button>
          </div>
        )}
      </div>

      {/* show_image */}
      <div className="flex items-center space-y-2 sm:col-span-2 lg:col-span-1">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            id="show_image"
            name="show_image"
            type="checkbox"
            checked={formik.values.show_image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">{t("show-image")}</span>
        </label>
      </div>
    </div>
  );
}
