import { Input, TextArea } from "@/components/common";
import FacilitiesInput from "./facilities-input";
import EquipmentInput from "./equipment-input";

export default function StudioArabicFields({ formik }) {
  return (
    <>
      <Input
        label="Studio Name"
        id="name"
        name="name"
        value={formik.values.name?.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.name?.ar && formik.errors.name?.ar}
        placeholder="Enter studio name"
      />

      <Input
        label="Address"
        id="address"
        name="address"
        value={formik.values.address?.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.address?.ar && formik.errors.address?.ar}
        placeholder="Enter studio address"
      />

      {/* Description */}
      <TextArea
        label="Description"
        value={formik.values.description.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        id="description"
        name="description"
        errors={formik.touched.description?.ar && formik.errors.description?.ar}
        placeholder="Enter studio Description"
        rows={4}
      />

      {/* Facilities */}
      <FacilitiesInput form={formik} lang="ar" />

      {/* Equipment */}
      <EquipmentInput form={formik} lang="ar" />
    </>
  );
}
