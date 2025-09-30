import { Input, TextArea } from "@/components/common";
import MultiLangArrayInput from "./multi-lang-array-input";

export default function EnglishFields({ formik }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Service Name */}
      <Input
        label="Service name"
        id="name.en"
        name="name.en"
        value={formik.values.name.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.name?.en && formik.errors.name?.en}
        placeholder="Enter english name"
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
        label="Service description"
        id="description.en"
        name="description.en"
        value={formik.values.description.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.description?.en && formik.errors.description?.en}
        placeholder="Enter english description"
        rows={4}
      />

      {/* Target Audience */}
      <MultiLangArrayInput
        form={formik}
        fieldName="target_audience"
        lang={"en"}
        labelKey="target-audience"
        placeholderKey="enter-target"
      />

      {/* Post-session Benefits */}
      <MultiLangArrayInput
        form={formik}
        fieldName="post_session_benefits"
        lang={"en"}
        labelKey="post-session-benefits"
        placeholderKey="enter-benefit"
      />

      {/* Details */}
      <MultiLangArrayInput
        form={formik}
        fieldName="details"
        lang={"en"}
        labelKey="details"
        placeholderKey="enter-detail"
      />
    </div>
  );
}
