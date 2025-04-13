import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const useSigninForm = () => {
    const [serverError, setServerError] = useState("");

    const { mutate: signin, isLoading } = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post("/api/signin", data);
            return response.data;
        },
        onSuccess: (data) => {
            console.log("Signin success:", data);
            // Trigger post-signin logic here (e.g., token storage, redirect, context update)
        },
        onError: (error) => {
            console.error("Signin error:", error);
            setServerError(error.response?.data?.message || "Something went wrong");
        }
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Please enter a valid email address")
                .required("Email is required to sign in"),

            password: Yup.string()
                .required("Password cannot be empty. Please enter your password"),
        }),
        onSubmit: (values) => {
            setServerError("");
            console.log("Form data", values);
            alert("Form submitted successfully!");
            // signin(values);
        },
    });

    return {
        formik,
        isLoading,
        serverError
    };
};

export default useSigninForm;
