import { Input, TextArea } from "@/components/common";
import FacilitiesInput from "./facilities-input";
import EquipmentInput from "./equipment-input";

export default function StudioEnglishFields({ formik }) {
  return (
    <>
      <Input
        label="Studio Name"
        id="name.en"
        name="name.en"
        value={formik.values.name.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.name?.en && formik.errors.name?.en}
        placeholder="Enter studio name"
      />

      <Input
        label="Address"
        id="address.en"
        name="address.en"
        value={formik.values.address.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.address?.en && formik.errors.address?.en}
        placeholder="Enter studio address"
      />

      {/* Description */}
      <TextArea
        label="Description"
        id="description.en"
        name="description.en"
        value={formik.values.description.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.touched.description?.en && formik.errors.description?.en}
        placeholder="Enter studio description"
        rows={4}
      />

      {/* Facilities */}
      <FacilitiesInput form={formik} lang="en" />

      {/* Equipment */}
      <EquipmentInput form={formik} lang="en" />
    </>
  );
}
