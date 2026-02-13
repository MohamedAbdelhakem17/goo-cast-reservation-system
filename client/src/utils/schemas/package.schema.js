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

    not_included: {
      ar: Array.isArray(pkg?.not_included?.ar) ? pkg.not_included.ar : [],
      en: Array.isArray(pkg?.not_included?.en) ? pkg.not_included.en : [],
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

    not_included_post_session_benefits: {
      ar: Array.isArray(pkg?.not_included_post_session_benefits?.ar)
        ? pkg.not_included_post_session_benefits.ar
        : [],
      en: Array.isArray(pkg?.not_included_post_session_benefits?.en)
        ? pkg.not_included_post_session_benefits.en
        : [],
    },

    session_type: {
      ar: pkg?.session_type?.ar || "",
      en: pkg?.session_type?.en || "",
    },

    package_type: pkg?.package_type || "basic",

    price: pkg?.price ?? "",

    image: pkg?.image ?? null,

    is_active: pkg?.is_active ?? true,

    icon: pkg?.icon || "",

    best_for: pkg?.best_for || "",
    show_image: pkg?.show_image ?? false,
    // For tracking changes
    current_target_audience: "",
    current_post_session_benefits: "",
    current_details: "",
    current_not_included: "",
    current_not_included_post_session_benefits: "",
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
      .min(0, "Please provide at least one Arabic detail."),
    en: Yup.array()
      .of(Yup.string().required("Each English detail is required."))
      .min(0, "Please provide at least one English detail."),
  }),

  not_included: Yup.object()
    .shape({
      ar: Yup.array().of(Yup.string()).optional(),
      en: Yup.array().of(Yup.string()).optional(),
    })
    .optional(),

  target_audience: Yup.object().shape({
    ar: Yup.array()
      .of(Yup.string().required("Each Arabic audience is required."))
      .min(0, "Please provide at least one Arabic target audience."),
    en: Yup.array()
      .of(Yup.string().required("Each English audience is required."))
      .min(0, "Please provide at least one English target audience."),
  }),

  post_session_benefits: Yup.object().shape({
    ar: Yup.array()
      .of(Yup.string().required("Each Arabic benefit is required."))
      .min(0, "Please provide at least one Arabic post-session benefit."),
    en: Yup.array()
      .of(Yup.string().required("Each English benefit is required."))
      .min(0, "Please provide at least one English post-session benefit."),
  }),

  not_included_post_session_benefits: Yup.object().shape({
    ar: Yup.array()
      .of(Yup.string().required("Each Arabic benefit is required."))
      .min(0, "Please provide at least one Arabic post-session benefit."),
    en: Yup.array()
      .of(Yup.string().required("Each English benefit is required."))
      .min(0, "Please provide at least one English post-session benefit."),
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
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return null;
      return Number(originalValue);
    })
    .typeError("Price must be a valid number.")
    .nullable()
    .required("Please enter the price.")
    .min(0, "Price cannot be negative."),

  image: Yup.mixed()
    .test("fileRequired", "Please upload an image.", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true;
      return value && value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only image files are allowed (jpg, jpeg, png).", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true;
      return ["image/jpg", "image/jpeg", "image/png"].includes(value.type);
    }),

  is_active: Yup.boolean()
    .transform((value, originalValue) => {
      if (originalValue === "true") return true;
      if (originalValue === "false") return false;
      return value;
    })
    .required(),
  show_image: Yup.boolean()
    .transform((value, originalValue) => {
      if (originalValue === "true") return true;
      if (originalValue === "false") return false;
      return value;
    })
    .required(),

  best_for: Yup.number()
    .typeError("Best for must be a valid number.")
    .integer("Best for must be an integer.")
    .min(1, "Best for cannot be less than 1."),
});

export { getInitialPackageValues, packageValidationSchema };
