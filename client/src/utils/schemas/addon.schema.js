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
      otherwise: (schema) =>
        schema.test("fileType", "Only GIF images are allowed.", (value) => {
          if (!value || typeof value === "string") return true;
          return value.type === "image/gif";
        }),
    }),
  });

export { initialAddonValues, addonsValidationSchema };
