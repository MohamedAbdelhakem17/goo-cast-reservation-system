import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "@/constants/config";
import { useAuth } from "../../context/Auth-Context/AuthContext";

const useSigninForm = (onSuccessCallback) => {
  const [serverError, setServerError] = useState("");
  const { dispatch } = useAuth();

    const { mutate: signin, isLoading } = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
            return response.data.data;
        },
        onSuccess: (data) => {
            dispatch({ type: "LOGIN", payload: data });
            setServerError("");
            location.href = "/"; 
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            setServerError(error.response?.data?.message || "Something went wrong");
        },
    });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required to sign in"),
      password: Yup.string().required(
        "Password cannot be empty. Please enter your password"
      ),
    }),
    onSubmit: (values) => {
      signin(values);
    },
  });

  return {
    formik,
    isLoading,
    serverError,
  };
};

export default useSigninForm;
