import * as Yup from "yup";

const initialCategoryValues = {
  name: {
    ar: "",
    en: "",
  },
  minHours: "",
};

const categoryValidationSchema = Yup.object({
  name: Yup.object({
    ar: Yup.string().required("Category name in arabic is required"),
    en: Yup.string().required("Category name  in english is  required"),
  }),
  minHours: Yup.number().required("Minimum hours is required"),
});

export { initialCategoryValues, categoryValidationSchema };
