import * as Yup from "yup";

const getInitialValues = (editingCoupon) => ({
  name: editingCoupon?.name || "",
  code: editingCoupon?.code?.toUpperCase() || "",
  discount: editingCoupon?.discount || "",
  expires_at: editingCoupon?.expires_at?.slice(0, 10) || "",
  max_uses: editingCoupon?.max_uses || "",
});

const couponValidationSchema = Yup.object({
  name: Yup.string()
    .required("Code name can not be blank")
    .min(3, "Code name must be at least 3 characters"),
  code: Yup.string().required("Code cannot be blank"),
  discount: Yup.number()
    .required("Discount can not be blank")
    .min(1, "Discount must be greater than 0")
    .max(100, "Discount must be at most 100"),
  expires_at: Yup.date().required("Expires at can not be blank"),
  max_uses: Yup.number()
    .required("Max uses can not be blank")
    .min(1, "Max uses must be at least 1"),
});

export { couponValidationSchema, getInitialValues };
