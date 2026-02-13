import { useTranslation } from "react-i18next";
import * as Yup from "yup";

const usePromotionSchema = () => {
  // Translating
  const { t } = useTranslation();

  const getInitialValues = (promotion) => ({
    _id: promotion?._id || "",
    title: {
      en: promotion?.title?.en || "",
      ar: promotion?.title?.ar || "",
    },
    description: {
      en: promotion?.description?.en || "",
      ar: promotion?.description?.ar || "",
    },
    start_date: promotion?.start_date?.slice(0, 10) || "",
    end_date: promotion?.end_date?.slice(0, 10) || "",
    priority: promotion?.priority || "",
    isEnabled: promotion?.isEnabled || false,
    hasLink: promotion?.hasLink || false,
    link: promotion?.link || "",
    hasTimer: promotion?.hasTimer || true,
  });

  const promotionValidationSchema = Yup.object({
    title: Yup.object({
      en: Yup.string()
        .required(t("title-en-required"))
        .min(3, t("title-en-min", { count: 3 })),
      ar: Yup.string()
        .required(t("title-ar-required"))
        .min(3, t("title-ar-min", { count: 3 })),
    }),
    description: Yup.object({
      en: Yup.string()
        .required(t("description-en-required"))
        .min(10, t("description-en-min", { count: 10 })),
      ar: Yup.string()
        .required(t("description-ar-required"))
        .min(10, t("description-ar-min", { count: 10 })),
    }),
    start_date: Yup.date()
      .required(t("start-date-required"))
      .typeError(t("start-date-invalid")),
    end_date: Yup.date()
      .required(t("end-date-required"))
      .typeError(t("end-date-invalid"))
      .min(Yup.ref("start_date"), t("end-date-must-be-after-start"))
      .test("not-same-as-start", t("dates-cannot-be-same"), function (value) {
        const { start_date } = this.parent;
        if (!start_date || !value) return true;
        return new Date(value).getTime() !== new Date(start_date).getTime();
      }),
    priority: Yup.number()
      .typeError(t("priority-must-be-number"))
      .integer(t("priority-must-be-integer"))
      .min(0, t("priority-min", { count: 0 })),
    isEnabled: Yup.boolean(),
  });
  return { getInitialValues, promotionValidationSchema };
};

export default usePromotionSchema;
