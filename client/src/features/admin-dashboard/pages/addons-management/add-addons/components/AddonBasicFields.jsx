import { Input, TextArea } from "@/components/common";

/**
 * Basic addon fields component (name, description, price, active status)
 */
export const AddonBasicFields = ({ form, t }) => {
  return (
    <>
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
    </>
  );
};
