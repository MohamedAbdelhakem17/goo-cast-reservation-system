import { Input, TextArea } from "@/components/common";
import FacilitiesInput from "./facilities-input";
import EquipmentInput from "./equipment-input";

export default function StudioArabicFields({ formik }) {
  return (
    <>
      {/* Studio name */}
      <Input
        label="Studio Name"
        id="name.ar"
        name="name.ar"
        value={formik.values.name?.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors.name?.ar}
        touched={formik.touched.name?.ar}
        placeholder="Enter studio name"
      />

      {/* Address */}
      <Input
        label="Address"
        id="address.ar"
        name="address.ar"
        value={formik.values.address?.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors.address?.ar}
        touched={formik.touched.address?.ar}
        placeholder="Enter studio address"
      />

      {/* Description */}
      <TextArea
        label="Description"
        value={formik.values.description?.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        id="description.ar"
        name="description.ar"
        errors={formik.errors.description?.ar}
        touched={formik.touched.description?.ar}
        placeholder="Enter studio description"
        rows={4}
      />

      {/* Facilities */}
      <FacilitiesInput form={formik} lang="ar" />

      {/* Equipment */}
      <EquipmentInput form={formik} lang="ar" />
    </>
  );
}
