import * as Yup from "yup";
import { DateTime } from "luxon";

export const getBookingInitialValues = (parsedData = null) => {
  if (parsedData) return parsedData;

  const handelStartDate = () => {
    let date = DateTime.now().setZone("Africa/Cairo");
    if (date.hour > 18) {
      date = date.plus({ days: 1 });
    }
    return date.toISO();
  };

  return {
    studio: { id: null, name: "", image: "", price: 0 },
    date: handelStartDate(),
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
      brand: "",
    },
    totalPackagePrice: 0,
    totalPrice: 0,
    totalPriceAfterDiscount: 0,
    couponCode: "",
    discount: "",
    paymentMethod: "CASH",
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
      brand: Yup.string().optional(),
    }),

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
