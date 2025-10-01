import { Input, TextArea } from "@/components/common";
import MultiLangArrayInput from "./multi-lang-array-input";
import useLocalization from "@/context/localization-provider/localization-context";

export default function EnglishFields({ formik }) {
  const { t } = useLocalization();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Service Name */}
      <Input
        label={t("service-name")}
        id="name.en"
        name="name.en"
        value={formik.values.name.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.name?.en && formik.errors.name?.en}
        placeholder={t("enter-english-name")}
        className="col-span-1 md:col-span-2"
      />

      {/* Session Type */}
      {/* <Input
        label="Session type"
        id="session_type.en"
        name="session_type.en"
        value={formik.values.session_type.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.session_type?.en && formik.errors.session_type?.en}
        placeholder="Enter english session type"
      /> */}

      {/* Service Description */}
      <TextArea
        label={t("service-description")}
        id="description.en"
        name="description.en"
        value={formik.values.description.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.description?.en && formik.errors.description?.en}
        placeholder={t("enter-english-description")}
        rows={4}
      />

      {/* Target Audience */}
      <MultiLangArrayInput
        form={formik}
        fieldName="target_audience"
        lang={"en"}
        labelKey={t("target-audience-0")}
        placeholderKey={t("enter-target")}
      />

      {/* Post-session Benefits */}
      <MultiLangArrayInput
        form={formik}
        fieldName="post_session_benefits"
        lang={"en"}
        labelKey={t("post-session-benefits")}
        placeholderKey={t("enter-benefit")}
      />

      {/* Details */}
      <MultiLangArrayInput
        form={formik}
        fieldName="details"
        lang={"en"}
        labelKey={t("details-0")}
        placeholderKey={t("enter-detail-0")}
      />
    </div>
  );
}
