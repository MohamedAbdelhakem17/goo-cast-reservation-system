import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "../../context/Auth-Context/AuthContext";
import axiosInstance from "../../utils/axios-instance";
import useLocalization from "@/context/localization-provider/localization-context";

const useSigninForm = (onSuccessCallback) => {
  const { t } = useLocalization();
  const { dispatch } = useAuth();

  const {
    mutate: signin,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(`/auth/login`, data);

      return response.data.data;
    },

    onSuccess: (data) => {
      dispatch({ type: "LOGIN", payload: data });

      location.href = "/";

      if (onSuccessCallback) onSuccessCallback();
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("please-enter-a-valid-email-address"))
        .required(t("email-is-required-to-sign-in")),
      password: Yup.string().required(
        t("password-cannot-be-empty-please-enter-your-password"),
      ),
    }),
    onSubmit: (values) => {
      signin(values);
    },
    enableReinitialize: true,
  });

  return {
    formik,
    isPending,
    error,
  };
};

export default useSigninForm;
