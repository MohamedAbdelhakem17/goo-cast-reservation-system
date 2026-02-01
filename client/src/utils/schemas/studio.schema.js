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
    equipment: studio?.equipment ?? { en: [], ar: [] },
    facilities: studio?.facilities ?? { en: [], ar: [] },
    startTime: studio?.startTime || "12:00",
    endTime: studio?.endTime || "20:00",
    thumbnail: studio?.thumbnail || null,
    live_view: studio?.live_view || null,
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
    recording_seats: 1,
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
    .transform((value, originalValue) =>
      originalValue === "" ? null : Number(originalValue),
    )
    .typeError("Price must be a number")
    .min(0, "Base price must be greater than or equal to 0")
    .required("Base price is required"),
  isFixedHourly: Yup.boolean().transform((val, orig) => {
    if (orig === "true") return true;
    if (orig === "false") return false;
    return val;
  }),
  description: Yup.object({
    ar: Yup.string()
      .required("Arabic description is required")
      .min(50, "Description must be at least 50 characters"),
    en: Yup.string()
      .required("English description is required")
      .min(50, "Description must be at least 50 characters"),
  }),

  equipment: Yup.object({
    ar: Yup.array()
      .of(Yup.string().min(2, "Arabic equipment item too short"))
      .min(1, "At least one Arabic equipment item is required"),
    en: Yup.array()
      .of(Yup.string().min(2, "English equipment item too short"))
      .min(1, "At least one English equipment item is required"),
  }),

  facilities: Yup.object({
    ar: Yup.array()
      .of(Yup.string().min(2, "Arabic facility item too short"))
      .min(1, "At least one Arabic facility item is required"),
    en: Yup.array()
      .of(Yup.string().min(2, "English facility item too short"))
      .min(1, "At least one English facility item is required"),
  }),

  startTime: Yup.string()
    .required("Start time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: Yup.string()
    .required("End time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),

  thumbnail: Yup.mixed()
    .required("Thumbnail is required")
    .test("fileSize", "File too large", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true;
      return value.size <= 5000000;
    })
    .test("fileType", "Unsupported file type", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),

  live_view: Yup.mixed()
    .nullable()
    .optional()
    .test("fileSize", "File too large", (value) => {
      if (!value || typeof value === "string") return true;
      return value.size <= 5000000;
    })
    .test("fileType", "Unsupported file type", (value) => {
      if (!value || typeof value === "string") return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),

  imagesGallery: Yup.array()
    .optional()
    .test("fileSize", "One or more files are too large", (values) => {
      if (!values) return true;
      return values.every((file) =>
        typeof file === "string" ? true : file.size <= 5000000,
      );
    })
    .test("fileType", "Unsupported file type", (values) => {
      if (!values) return true;
      return values.every((file) =>
        typeof file === "string"
          ? true
          : ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      );
    }),

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

  recording_seats: Yup.number().min(1, "number of recording seats must be at least 1"),
});
