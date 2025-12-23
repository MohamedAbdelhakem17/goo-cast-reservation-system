import { DateTime } from "luxon";
import * as Yup from "yup";

export const getBookingInitialValues = (data = null) => {
  //  get start date
  const getDefaultDate = () => {
    let date = DateTime.now().setZone("Africa/Cairo");
    if (date.hour > 18) date = date.plus({ days: 1 });
    return date.toISO();
  };

  //  Default form structure
  const defaultValues = {
    studio: { id: null, name: "", image: "", price: 0, recording_seats: 1 },
    date: getDefaultDate(),
    startSlot: null,
    endSlot: null,
    duration: 1,
    persons: 1,
    selectedPackage: {},
    selectedAddOns: [],
    personalInfo: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
    extraComment: "",
    totalPackagePrice: 0,
    totalPrice: 0,
    totalPriceAfterDiscount: 0,
    couponCode: "",
    discount: "",
    paymentMethod: "CASH",
  };

  //  No data → return defaults
  if (!data) return defaultValues;

  //  Data already matches form structure → return as is
  const isFormSchema =
    data?.studio?.id !== undefined && data?.personalInfo?.firstName !== undefined;

  if (isFormSchema) return data;

  //  Data from backend → map it to form structure
  const booking = data;
  const [firstName, ...lastNameParts] = booking.personalInfo?.fullName?.split(" ") || [];

  return {
    ...defaultValues,
    studio: {
      id: booking.studio?._id || booking.studio?.id || null,
      name: booking.studio?.name || {},
      image: booking.studio?.thumbnail || "",
      price: booking.studio?.basePricePerSlot || 0,
      recording_seats: booking.studio?.recording_seats | 1,
    },
    date: booking.date ? new Date(booking.date) : getDefaultDate(),
    startSlot: booking.startSlot || null,
    endSlot: booking.endSlot || null,
    duration: booking.duration || 1,
    persons: booking.persons || 1,
    selectedPackage: booking.package || {},
    selectedAddOns:
      booking.addOns?.map((a) => ({
        id: a.item?._id || a.item?.id || "",
        name: a.item?.name || {},
        price: a.price ?? a.item?.price ?? 0,
        quantity: a.quantity ?? 1,
      })) || [],

    personalInfo: {
      firstName: firstName || "",
      lastName: lastNameParts.join(" ") || "",
      phone: booking.personalInfo?.phone || "",
      email: booking.personalInfo?.email || "",
    },
    extraComment: "",
    totalPackagePrice: booking.totalPackagePrice || 0,
    totalPrice: booking.totalPrice || 0,
    totalPriceAfterDiscount: booking.totalPriceAfterDiscount || 0,
    couponCode: booking.coupon_code || booking.couponCode || "",
    totalAddOnsPrice: booking.totalAddOnsPrice,
    discount: booking.discount || "",
    paymentMethod: booking.paymentMethod || "CASH",
  };
};

// Formik validation schema
export const getBookingValidationSchema = (t) =>
  Yup.object({
    selectedPackage: Yup.object()
      .test(
        t("is-not-empty"),
        t("package-is-required"),
        (value) => value && Object.keys(value).length > 0,
      )
      .required(t("package-is-required")),

    studio: Yup.object().required(t("studio-is-required")),
    endSlot: Yup.string().required("Time end slot is required"),
    startSlot: Yup.string().required("Time slot is required"),
    selectedAddOns: Yup.array().nullable().notRequired(),

    personalInfo: Yup.object({
      firstName: Yup.string().required(t("first-name-is-required")),
      lastName: Yup.string().required(t("last-name-is-required")),
      phone: Yup.string()
        .matches(/^01(0|1|2|5)[0-9]{8}$/, t("phone-number-is-not-valid"))
        .required(t("phone-is-required")),
      email: Yup.string().email(t("invalid-email")).required(t("email-is-required")),
    }),

    extraComments: Yup.string().optional(),
    totalPrice: Yup.number().required("Total price is required"),
    totalPriceAfterDiscount: Yup.number()
      .required("Discounted price is required")
      .test(
        "is-less-than-or-equal-total",
        "Discounted price must be less than or equal to total price",
        function (value) {
          const { totalPrice } = this.parent;
          if (value == null || totalPrice == null) return true;
          return value <= totalPrice;
        },
      ),

    couponCode: Yup.string().optional(),
    discount: Yup.string().optional(),
    paymentMethod: Yup.string()
      .oneOf(["CARD", "CASH"], "Invalid payment method")
      .required("Payment method is required"),
  });
