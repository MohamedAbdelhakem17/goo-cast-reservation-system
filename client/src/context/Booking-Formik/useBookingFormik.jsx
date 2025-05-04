import * as Yup from "yup";
import { useFormik } from "formik";

export default function useBookingFormik() {

    const localStorageData = localStorage.getItem("bookingData");
    const parsedData = localStorageData ? JSON.parse(localStorageData) : null;

    // Formik initial values
    const bookingInitialValues = parsedData || {
        studio: {
            id: null,
            name: "",
            image: "",
            price: 0,
        },
        date: null,
        startSlot: null,
        endSlot: null,
        duration: null,
        persons: 1,
        selectedPackage: {},
        selectedAddOns: [],
        personalInfo: {
            fullName: "",
            phone: "",
            email: "",
            brand: "",
        },
        totalPrice: 0,
    };

    // Formik validation schema
    const bookingValidationSchema = Yup.object({
        studio: Yup.object().required("Studio is required"),
        date: Yup.string().required("Date is required"),
        endSlot: Yup.string().required("Time slot is required"),
        startSlot: Yup.string().required("Time slot is required"),
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
        totalPrice: Yup.number().required("Total price is required"),
    });

    // Formik handleSubmit function
    const formik = useFormik({
        initialValues: bookingInitialValues,
        validationSchema: bookingValidationSchema,
        onSubmit: (values) => {
            const dataBaseObject = {
                ...values,
                studio: values.studio.id,
                date: new Date(values.date),
            };

            console.log("Final Submit:", dataBaseObject);

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
