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
        value={formik.values.name.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.name.ar && formik.errors.name.ar}
        placeholder="Enter studio name"
      />

      <Input
        label="Address"
        id="address"
        name="address"
        value={formik.values.address.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.address.ar && formik.errors.address.ar}
        placeholder="Enter studio address"
      />

      {/* Description */}
      <TextArea
        label="Description"
        value={form.values.description.ar}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        id="description"
        name="description"
        errors={form.touched.description.ar && form.errors.description.ar}
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
