import * as Yup from "yup";

const initialPackageValues = {
  name: {
    ar: "",
    en: "",
  },
  target_audience: {
    ar: [],
    en: [],
  },
  description: {
    ar: "",
    en: "",
  },
  category: "",
  details: {
    ar: "",
    en: "",
  },
  post_session_benefits: {
    ar: [],
    en: [],
  },
  session_type: {
    ar: "",
    en: "",
  },
  price: null,
  image: null,
  is_active: true,
  icon: "",
};

const getPackageValidationSchema = (isEdit = false) => {
  return Yup.object().shape({
    name: Yup.object().shape({
      ar: Yup.string()
        .typeError("Arabic name must be a text.")
        .required("Please enter the Arabic name."),
      en: Yup.string()
        .typeError("English name must be a text.")
        .required("Please enter the English name."),
    }),
    target_audience: Yup.object().shape({
      ar: Yup.string()
        .typeError("Arabic target audience must be a text.")
        .required("Please specify the Arabic target audience."),
      en: Yup.string()
        .typeError("English target audience must be a text.")
        .required("Please specify the English target audience."),
    }),
    description: Yup.object().shape({
      ar: Yup.string()
        .typeError("Arabic description must be a text.")
        .required("Please provide the Arabic description."),
      en: Yup.string()
        .typeError("English description must be a text.")
        .required("Please provide the English description."),
    }),
    category: Yup.object().shape({
      ar: Yup.string()
        .typeError("Arabic category must be a text.")
        .required("Please select the Arabic category."),
      en: Yup.string()
        .typeError("English category must be a text.")
        .required("Please select the English category."),
    }),
    details: Yup.object().shape({
      ar: Yup.string()
        .typeError("Arabic details must be a text.")
        .required("Please provide the Arabic details."),
      en: Yup.string()
        .typeError("English details must be a text.")
        .required("Please provide the English details."),
    }),
    post_session_benefits: Yup.object().shape({
      ar: Yup.string()
        .typeError("Arabic post-session benefits must be a text.")
        .required("Please list the Arabic post-session benefits."),
      en: Yup.string()
        .typeError("English post-session benefits must be a text.")
        .required("Please list the English post-session benefits."),
    }),
    session_type: Yup.object().shape({
      ar: Yup.string()
        .typeError("Arabic session type must be a text.")
        .required("Please specify the Arabic session type."),
      en: Yup.string()
        .typeError("English session type must be a text.")
        .required("Please specify the English session type."),
    }),
    price: Yup.number()
      .typeError("Price must be a valid number.")
      .required("Please enter the price.")
      .min(0, "Price cannot be negative."),
    image: isEdit
      ? Yup.mixed().nullable()
      : Yup.mixed()
          .required("Please upload an image.")
          .test(
            "fileSize",
            "Image size must be less than 5MB.",
            (value) => !value || (value && value.size <= 5 * 1024 * 1024),
          )
          .test(
            "fileType",
            "Only image files are allowed (jpg, jpeg, png).",
            (value) =>
              !value ||
              (value && ["image/jpg", "image/jpeg", "image/png"].includes(value.type)),
          ),
    is_active: Yup.boolean().required(),
  });
};

export { getPackageValidationSchema, initialPackageValues };
