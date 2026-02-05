import { Input, TextArea } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import MultiLangArrayInput from "../../../service-management/add-service/_components/multi-lang-array-input";
export default function StudioArabicFields({ formik }) {
  const { t } = useLocalization();
  return (
    <>
      {/* Studio name */}
      <Input
        label={t("studio-name")}
        id="name.ar"
        name="name.ar"
        value={formik.values.name?.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors.name?.ar}
        touched={formik.touched.name?.ar}
        placeholder={t("enter-studio-name")}
      />

      {/* Address */}
      <Input
        label={t("address")}
        id="address.ar"
        name="address.ar"
        value={formik.values.address?.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors.address?.ar}
        touched={formik.touched.address?.ar}
        placeholder={t("enter-studio-address")}
      />

      {/* Description */}
      <TextArea
        label={t("description")}
        value={formik.values.description?.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        id="description.ar"
        name="description.ar"
        errors={formik.errors.description?.ar}
        touched={formik.touched.description?.ar}
        placeholder={t("enter-studio-description")}
        rows={4}
      />

      {/* Facilities */}
      <MultiLangArrayInput
        form={formik}
        fieldName="facilities"
        lang="ar"
        labelKey="facilities"
        placeholderKey="enter-facility"
      />

      {/* Equipment */}
      <MultiLangArrayInput
        form={formik}
        fieldName="equipment"
        lang="ar"
        labelKey="equipment"
        placeholderKey="enter-equipment"
      />
    </>
  );
}
