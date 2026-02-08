import * as Yup from "yup";

const initialAddonValues = {
  name: {
    ar: "",
    en: "",
  },
  description: {
    ar: "",
    en: "",
  },
  price: null,
  image: "",
  is_active: true,
  // Recommendation fields
  category: "other",
  tags: [],
  recommendation_rules: {
    min_persons: null,
    max_persons: null,
    recommended_for_packages: [],
    excluded_from_packages: [],
    is_universal_recommendation: false,
    priority: 0,
  },
  unit: "hour",
};

const addonsValidationSchema = (isEdit = false) =>
  Yup.object({
    name: Yup.object({
      ar: Yup.string()
        .typeError("Arabic name must be a valid string.")
        .required("Arabic name is required."),
      en: Yup.string()
        .typeError("English name must be a valid string.")
        .required("English name is required."),
    }),

    description: Yup.object({
      ar: Yup.string()
        .typeError("Arabic description must be a valid string.")
        .required("Arabic description is required."),
      en: Yup.string()
        .typeError("English description must be a valid string.")
        .required("English description is required."),
    }),

    price: Yup.number()
      .typeError("Price must be a valid number.")
      .min(0, "Price must be greater than or equal to 0.")
      .required("Price is required."),

    image: Yup.mixed().when([], {
      is: () => !isEdit,
      then: (schema) =>
        schema
          .required("Image (GIF) is required.")
          .test("fileType", "Only GIF images are allowed.", (value) => {
            if (!value) return false;
            return value.type === "image/gif";
          }),
      otherwise: (schema) => schema.nullable(),
    }),

    category: Yup.string()
      .oneOf(["equipment", "editing", "production", "accessibility", "other"])
      .nullable(),

    tags: Yup.array().of(Yup.string()).nullable(),

    recommendation_rules: Yup.object({
      min_persons: Yup.number().nullable().min(0, "Minimum persons must be 0 or more"),
      max_persons: Yup.number().nullable().min(0, "Maximum persons must be 0 or more"),
      recommended_for_packages: Yup.array().of(Yup.string()).nullable(),
      excluded_from_packages: Yup.array().of(Yup.string()).nullable(),
      is_universal_recommendation: Yup.boolean(),
      priority: Yup.number().min(0).max(10, "Priority must be between 0-10"),
    }).nullable(),
    unit: Yup.string().trim().required("Unit is required."),
  });

export { addonsValidationSchema, initialAddonValues };
