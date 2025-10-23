import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/constants/config";
import useLocalization from "@/context/localization-provider/localization-context";

const SignupForm = ({ closeModel }) => {
  const { t } = useLocalization();
  // Server-side error state
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Regex for password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_]).{8,}$/;

  // Initial form values
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().trim().required(t("name-is-required-to-sign-up")),

    email: Yup.string()
      .trim()
      .email(t("please-enter-a-valid-email-address"))
      .required(t("email-is-required-to-sign-up")),

    password: Yup.string()
      .required(t("password-cannot-be-empty-please-enter-your-password"))
      .matches(passwordRegex, t("must-be-8-chars-with-upper-lower-number-and-symbol")),

    confirmPassword: Yup.string()
      .required(t("password-cannot-be-empty-please-enter-your-password"))
      .oneOf([Yup.ref("password"), null], t("passwords-must-match")),
  });

  // useMutation for signup request
  const {
    mutate: signup,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(API_BASE_URL + "/auth/signup", data);
      return response.data;
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message || t("something-went-wrong-please-try-again");
      setServerError(message);
    },
    onSuccess: (data) => {
      setSuccessMessage(data.data); // Set success message
      setServerError(null); // Clear server error on success
      if (!serverError) {
        setTimeout(() => closeModel(), 1000); // Close the modal on success
      }
    },
  });

  // Form submission handler
  const onSubmit = (values) => {
    signup(values);
  };

  // useFormik hook
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  // Return everything needed for the UI
  return {
    formik,
    isLoading,
    isError,
    isSuccess,
    error,
    serverError,
    successMessage,
  };
};

export default SignupForm;
