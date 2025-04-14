import * as Yup from "yup";
import { useFormik } from "formik";

export default function useBookingFormik() {

    // Formik initial values
    const bookingInitialValues = {
        studio: {
            id: null,
            name: "",
            image: "",
            price: 0,
        },
        date: null,
        timeSlot: null,
        duration: 1,
        persons: 1,
        selectedPackage: {},
        selectedAddOns: [],
        personalInfo: {
            fullName: "",
            phone: "",
            email: "",
            brand: "",
        },
    };

    // Formik validation schema
    const bookingValidationSchema = Yup.object({
        studio: Yup.object().required("Studio is required"),
        date: Yup.string().required("Date is required"),
        timeSlot: Yup.string().required("Time slot is required"),
        duration: Yup.number().min(1).required("Duration is required"),
        persons: Yup.number().min(1).required("Number of persons is required"),
        selectedPackage: Yup.object().nullable().notRequired(),
        selectedAddOns: Yup.array().nullable().notRequired(),
        personalInfo: Yup.object({
            fullName: Yup.string().required("Full name is required"),
            phone: Yup.string()
                .matches(/^[0-9]{10,15}$/, "Phone number is not valid")
                .required("Phone is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            brand: Yup.string().optional(),
        }),
    });

    // Formik handleSubmit function
    const formik = useFormik({
        initialValues: bookingInitialValues,
        validationSchema: bookingValidationSchema,
        onSubmit: (values) => {
            console.log("Final Submit:", values);
        },
        enableReinitialize: true,
    });


    // Helpers Functions to access formik values and errors
    const setBookingField = (field, value) => {
        formik.setFieldValue(field, value);
    };

    const getBookingField = (field) => {
        const keys = field.split(".");
        return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.values);
    };

    const getBookingError = (field) => {
        const keys = field.split(".");
        return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.errors);
    };

    return {
        formik,
        values: formik.values,
        setBookingField,
        getBookingField,
        getBookingError,
    };
}
