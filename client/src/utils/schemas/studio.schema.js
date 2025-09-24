import * as Yup from "yup";

export const getStudioInitialValues = (studio) => {
  return {
    name: {
      ar: studio?.name?.ar || "",
      en: studio?.name?.en || "",
    },
    address: {
      ar: studio?.address?.ar || "",
      en: studio?.address?.en || "",
    },
    basePricePerSlot: studio?.basePricePerSlot ?? "",
    isFixedHourly: studio?.isFixedHourly ?? true,
    description: {
      ar: studio?.description?.ar || "",
      en: studio?.description?.en || "",
    },
    facilities: studio?.facilities?.length > 0 ? studio.facilities : [{ ar: "", en: "" }],
    equipment: studio?.equipment?.length > 0 ? studio.equipment : [{ ar: "", en: "" }],
    startTime: studio?.startTime || "12:00",
    endTime: studio?.endTime || "20:00",
    thumbnail: studio?.thumbnail || null,
    imagesGallery: studio?.imagesGallery || [],
    dayOff: studio?.dayOff || [],
    minSlotsPerDay: studio?.minSlotsPerDay || {
      sunday: 1,
      monday: 1,
      tuesday: 1,
      wednesday: 1,
      thursday: 1,
      friday: 1,
      saturday: 1,
    },
    currentFacility: "",
    currentEquipment: "",
  };
};

export const validationSchema = Yup.object({
  name: Yup.object({
    ar: Yup.string()
      .required("Arabic name is required")
      .max(50, "Name must be less than 50 characters"),
    en: Yup.string()
      .required("English name is required")
      .max(50, "Name must be less than 50 characters"),
  }),
  address: Yup.object({
    ar: Yup.string()
      .required("Arabic address is required")
      .max(100, "Address must be less than 100 characters"),
    en: Yup.string()
      .required("English address is required")
      .max(100, "Address must be less than 100 characters"),
  }),
  basePricePerSlot: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Base price must be greater than or equal to 0")
    .required("Base price is required"),
  isFixedHourly: Yup.boolean(),
  description: Yup.object({
    ar: Yup.string()
      .required("Arabic description is required")
      .min(50, "Description must be at least 50 characters"),
    en: Yup.string()
      .required("English description is required")
      .min(50, "Description must be at least 50 characters"),
  }),

  startTime: Yup.string()
    .required("Start time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: Yup.string()
    .required("End time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  thumbnail: Yup.mixed()
    .required("Thumbnail is required")
    .test("fileSize", "File too large", (value) => !value || value.size <= 5000000)
    .test(
      "fileType",
      "Unsupported file type",
      (value) => !value || ["image/jpeg", "image/png", "image/jpg"].includes(value.type),
    ),
  imagesGallery: Yup.array()
    .min(1, "At least one gallery image is required")
    .max(5, "Maximum 5 images allowed")
    .test(
      "fileSize",
      "One or more files are too large",
      (values) => !values || values.every((file) => file.size <= 5000000),
    )
    .test(
      "fileType",
      "Unsupported file type",
      (values) =>
        !values ||
        values.every((file) =>
          ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
        ),
    ),
  dayOff: Yup.array()
    .of(
      Yup.string().oneOf([
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ]),
    )
    .nullable(),
  minSlotsPerDay: Yup.object().shape({
    sunday: Yup.number().min(0, "Minimum slots must be at least 0"),
    monday: Yup.number().min(0, "Minimum slots must be at least 0"),
    tuesday: Yup.number().min(0, "Minimum slots must be at least 0"),
    wednesday: Yup.number().min(0, "Minimum slots must be at least 0"),
    thursday: Yup.number().min(0, "Minimum slots must be at least 0"),
    friday: Yup.number().min(0, "Minimum slots must be at least 0"),
    saturday: Yup.number().min(0, "Minimum slots must be at least 0"),
  }),
});
