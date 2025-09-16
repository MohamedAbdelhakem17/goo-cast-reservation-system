import { Input, TextArea } from "@/components/common";

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
      />

      {/* Target Audience */}
      <Input
        label="Target audience"
        id="target_audience.en"
        name="target_audience.en"
        value={formik.values.target_audience.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.target_audience?.en && formik.errors.target_audience?.en}
        placeholder="Enter english target audience"
      />

      {/* Session Type */}
      <Input
        label="Session type"
        id="session_type.en"
        name="session_type.en"
        value={formik.values.session_type.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.session_type?.en && formik.errors.session_type?.en}
        placeholder="Enter english session type"
      />

      {/* Category */}
      <Input
        label="Category"
        id="category.en"
        name="category.en"
        value={formik.values.category.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.category?.en && formik.errors.category?.en}
        placeholder="Enter english category"
      />

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

      {/* Details */}
      <TextArea
        label="Details"
        id="details.en"
        name="details.en"
        value={formik.values.details.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.details?.en && formik.errors.details?.en}
        placeholder="Enter english details"
        rows={4}
      />

      {/* Post-session Benefits */}
      <TextArea
        label="Post-session benefits"
        id="post_session_benefits.en"
        name="post_session_benefits.en"
        value={formik.values.post_session_benefits.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={
          formik.touched.post_session_benefits?.en &&
          formik.errors.post_session_benefits?.en
        }
        placeholder="Enter english post-session benefits"
        rows={4}
      />
    </div>
  );
}
