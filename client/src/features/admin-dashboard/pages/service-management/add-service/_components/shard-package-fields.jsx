import { useMemo } from "react";
import { Input, SelectInput } from "@/components/common";
import { useGetAllCategories } from "@/apis/admin/manage-category.api";
import useLocalization from "@/context/localization-provider/localization-context";

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
    </div>
  );
}
