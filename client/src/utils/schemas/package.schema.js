import * as Yup from "yup";

const getInitialPackageValues = (pkg) => {
  return {
    name: {
      ar: pkg?.name?.ar || "",
      en: pkg?.name?.en || "",
    },

    description: {
      ar: pkg?.description?.ar || "",
      en: pkg?.description?.en || "",
    },

    category: pkg?.category?._id || "",

    details: {
      ar: Array.isArray(pkg?.details?.ar) ? pkg.details.ar : [],
      en: Array.isArray(pkg?.details?.en) ? pkg.details.en : [],
    },

    target_audience: {
      ar: Array.isArray(pkg?.target_audience?.ar) ? pkg.target_audience.ar : [],
      en: Array.isArray(pkg?.target_audience?.en) ? pkg.target_audience.en : [],
    },

    post_session_benefits: {
      ar: Array.isArray(pkg?.post_session_benefits?.ar)
        ? pkg.post_session_benefits.ar
        : [],
      en: Array.isArray(pkg?.post_session_benefits?.en)
        ? pkg.post_session_benefits.en
        : [],
    },

    session_type: {
      ar: pkg?.session_type?.ar || "",
      en: pkg?.session_type?.en || "",
    },

    price: pkg?.price ?? null,

    image: pkg?.image ?? null,

    is_active: pkg?.is_active ?? true,

    icon: pkg?.icon || "",

    current_target_audience: "",
    current_post_session_benefits: "",
    current_details: "",
  };
};

const packageValidationSchema = Yup.object().shape({
  name: Yup.object().shape({
    ar: Yup.string()
      .typeError("Arabic name must be a text.")
      .required("Please enter the Arabic name."),
    en: Yup.string()
      .typeError("English name must be a text.")
      .required("Please enter the English name."),
  }),

  description: Yup.object().shape({
    ar: Yup.string()
      .typeError("Arabic description must be a text.")
      .required("Please provide the Arabic description."),
    en: Yup.string()
      .typeError("English description must be a text.")
      .required("Please provide the English description."),
  }),

  category: Yup.string()
    .typeError("Category must be selected.")
    .required("Please select a category."),

  details: Yup.object().shape({
    ar: Yup.array()
      .of(Yup.string().required("Each Arabic detail is required."))
      .min(1, "Please provide at least one Arabic detail."),
    en: Yup.array()
      .of(Yup.string().required("Each English detail is required."))
      .min(1, "Please provide at least one English detail."),
  }),

  target_audience: Yup.object().shape({
    ar: Yup.array()
      .of(Yup.string().required("Each Arabic audience is required."))
      .min(1, "Please provide at least one Arabic target audience."),
    en: Yup.array()
      .of(Yup.string().required("Each English audience is required."))
      .min(1, "Please provide at least one English target audience."),
  }),

  post_session_benefits: Yup.object().shape({
    ar: Yup.array()
      .of(Yup.string().required("Each Arabic benefit is required."))
      .min(1, "Please provide at least one Arabic post-session benefit."),
    en: Yup.array()
      .of(Yup.string().required("Each English benefit is required."))
      .min(1, "Please provide at least one English post-session benefit."),
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

  image: Yup.mixed()
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

export { packageValidationSchema, getInitialPackageValues };
