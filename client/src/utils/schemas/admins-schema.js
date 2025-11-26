import useLocalization from "@/context/localization-provider/localization-context";
import * as Yup from "yup";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const useAdminSchema = () => {
  // Localization
  const { t } = useLocalization();

  // Initial Values
  const getInitialValues = (InitialValues = {}) => ({
    name: InitialValues?.name || "",
    email: InitialValues?.email || "",
    password: InitialValues?.password || "",
    confirmPassword: InitialValues?.confirmPassword || "",
    role: "",
  });

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().trim().required(t("name-is-required-to-sign-up")),

    email: Yup.string()
      .trim()
      .email(t("please-enter-a-valid-email-address"))
      .required(t("email-is-required-to-sign-up")),

    role: Yup.string().required(),

    password: Yup.string()
      .required(t("password-cannot-be-empty-please-enter-your-password"))
      .matches(passwordRegex, t("must-be-8-chars-with-upper-lower-number-and-symbol")),

    confirmPassword: Yup.string()
      .required(t("password-cannot-be-empty-please-enter-your-password"))
      .oneOf([Yup.ref("password"), null], t("passwords-must-match")),
  });

  return { getInitialValues, validationSchema };
};

export default useAdminSchema;
