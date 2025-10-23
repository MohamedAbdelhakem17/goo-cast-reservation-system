import { Input, TextArea } from "@/components/common";
import FacilitiesInput from "./facilities-input";
import EquipmentInput from "./equipment-input";
import useLocalization from "@/context/localization-provider/localization-context";

export default function StudioEnglishFields({ formik }) {
  const { t } = useLocalization();
  return (
    <>
      <Input
        label={t("studio-name")}
        id="name.en"
        name="name.en"
        value={formik.values.name.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.name?.en && formik.errors.name?.en}
        touched={formik.touched.name?.en}
        placeholder={t("enter-studio-name")}
      />

      <Input
        label={t("address")}
        id="address.en"
        name="address.en"
        value={formik.values.address.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        touched={formik.touched.address?.en}
        errors={formik.touched.address?.en && formik.errors.address?.en}
        placeholder={t("enter-studio-address")}
      />

      {/* Description */}
      <TextArea
        label={t("description")}
        id="description.en"
        name="description.en"
        value={formik.values.description.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.description?.en && formik.errors.description?.en}
        placeholder={t("enter-studio-description")}
        touched={formik.touched.description?.en}
        rows={4}
      />

      {/* Facilities */}
      <FacilitiesInput form={formik} lang="en" />

      {/* Equipment */}
      <EquipmentInput form={formik} lang="en" />
    </>
  );
}
