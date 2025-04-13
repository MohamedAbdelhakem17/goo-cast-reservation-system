import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const SignupForm = () => {
    // Server-side error state
    const [serverError, setServerError] = useState(null);

    // Regex for password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_]).{8,}$/;

    // Initial form values
    const initialValues = {
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    };

    // Yup validation schema
    const validationSchema = Yup.object({
        userName: Yup.string()
            .trim()
            .required("Name is required to sign up"),

        email: Yup.string()
            .trim()
            .email("Please enter a valid email address")
            .required("Email is required to sign up"),

        password: Yup.string()
            .required("Password cannot be empty. Please enter your password")
            .matches(
                passwordRegex,
                "Must be 8+ chars with upper, lower, number & symbol"
            ),

        confirmPassword: Yup.string()
            .required("Password cannot be empty. Please enter your password")
            .oneOf([Yup.ref("password"), null], "Passwords must match"),
    });

    // useMutation for signup request
    const { mutate: signup, isLoading, isError, isSuccess, error } = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post("/api/signup", data);
            return response.data;
        },
        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";
            setServerError(message);
        },
        onSuccess: () => {
            setServerError(null); // Clear server error on success
        }
    });

    // Form submission handler
    const onSubmit = (values) => {
        console.log("Form data", values);
        alert("Form submitted successfully!");
        // signup(values);
    };

    // useFormik hook
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
    });

    // Return everything needed for the UI
    return {
        formik,
        isLoading,
        isError,
        isSuccess,
        error,
        serverError
    };
};

export default SignupForm;
