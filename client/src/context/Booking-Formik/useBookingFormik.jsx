import * as Yup from "yup";
import { useFormik } from "formik";
import { CreateBooking } from "../../apis/Booking/booking.api";
import { useMemo, useCallback } from "react";
export default function useBookingFormik() {

    const parsedData = useMemo(() => {
        const localStorageData = localStorage.getItem("bookingData");
        return localStorageData ? JSON.parse(localStorageData) : null;
    }, []);

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

    const { mutate: createBooking } = CreateBooking()
    // Formik handleSubmit function
    const formik = useFormik({
        initialValues: bookingInitialValues,
        validationSchema: bookingValidationSchema,

        onSubmit: (values) => {

            const totalAddOnPrice = values.selectedAddOns?.reduce((acc, item) => {
                return acc + (item.quantity > 0 ? item.price * item.quantity : 0)
            }, 0) || 0
            const totalPrice = Number(values.studio?.price || 0) + totalAddOnPrice + (values.selectedPackage?.price || 0)

            const dataBaseObject = {
                ...values,
                studio: {
                    id: values.studio.id,
                    price: values.studio.price,
                },
                package: {
                    id: values.selectedPackage.id,
                    slot: values.selectedPackage.slot,
                },
                totalPrice
            };

            createBooking(dataBaseObject, {
                onSuccess: () => {
                    alert("Booking submitted successfully");
                },
                onError: (error) => {
                    console.error("Error creating booking:", error);
                }
            })

            // console.log("Final Submit:", dataBaseObject);

        },
        enableReinitialize: true,
    });



    // Helpers Functions to access formik values and errors
    const setBookingField = useCallback((field, value) => {
        formik.setFieldValue(field, value);
    }, [formik]);


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
