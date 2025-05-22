import * as Yup from "yup";
import { useFormik } from "formik";
import { useToast } from "../../context/Toaster-Context/ToasterContext";
import { CreateBooking } from "../../apis/Booking/booking.api";
import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
export default function useBookingFormik() {

    const parsedData = useMemo(() => {
        const localStorageData = localStorage.getItem("bookingData");
        return localStorageData ? JSON.parse(localStorageData) : null;
    }, []);

    // Formik initial values
    const bookingInitialValues = useMemo(() => {
        if (parsedData) return parsedData;

        const handelStartDate = () => {
            const date = new Date();
            const hour = date.getHours();
            hour > 18 ? date.setDate(date.getDate() + 1) : date.setDate(date.getDate());
            return date
        };

        return {
            studio: {
                id: null,
                name: "",
                image: "",
                price: 0,
            },
            date: handelStartDate(),
            startSlot: null,
            endSlot: null,
            duration: 0,
            persons: 1,
            selectedPackage: {},
            selectedAddOns: [],
            personalInfo: {
                fullName: "",
                phone: "",
                email: "",
                brand: "",
            },
            totalPackagePrice: 0,
            totalPrice: 0,
            totalPriceAfterDiscount: 0,
            couponCode: ""
        };
    }, [parsedData]);


    // Formik validation schema
    const bookingValidationSchema = Yup.object({
        selectedPackage: Yup.object().test(
            "is-not-empty",
            "Package is required",
            value => value && Object.keys(value).length > 0
        ).required("Package is required"),
        studio: Yup.object().required("Studio is required"),
        endSlot: Yup.string().required("Time end slot is required"),
        startSlot: Yup.string().required("Time  slot is required"),
        selectedAddOns: Yup.array().nullable().notRequired(),
        personalInfo: Yup.object({
            fullName: Yup.string().required("Full name is required"),
            phone: Yup.string()
                .matches(/^01(0|1|2|5)[0-9]{8}$/, "Phone number is not valid")
                .required("Phone is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            brand: Yup.string().optional(),
        }),

        totalPrice: Yup.number()
            .required("Total price is required"),

        totalPriceAfterDiscount: Yup.number()
            .required("Discounted price is required")
            .test(
                "is-less-than-or-equal-total",
                "Discounted price must be less than or equal to total price",
                function (value) {
                    const { totalPrice } = this.parent;
                    if (value == null || totalPrice == null) return true;
                    return value <= totalPrice;
                }
            )

    });

    const { mutate: createBooking } = CreateBooking()
    const navigate = useNavigate()
    const { addToast } = useToast()
    // Formik handleSubmit function
    const formik = useFormik({
        initialValues: bookingInitialValues,
        validationSchema: bookingValidationSchema,

        onSubmit: (values) => {
            const dataBaseObject = {
                ...values,
                studio: {
                    id: values.studio.id,
                },
                package: {
                    id: values.selectedPackage.id,
                },
                totalPrice: values.totalPrice,
                coupon_code: values.couponCode,
                totalPriceAfterDiscount: values.totalPriceAfterDiscount || values.totalPrice
            };

            createBooking(dataBaseObject, {
                onSuccess: (res) => {
                    addToast(res.message || "Booking submitted successfully", "success", 3000);
                    setTimeout(() => {
                        navigate("/")
                    }, 3200)
                },
                onError: (error) => {
                    addToast(error.response?.data?.message || "Something went wrong", "error");
                }
            })
        },
        enableReinitialize: true,
    });



    // Helpers Functions to access formik values and errors
    const setBookingField = useCallback((field, value) => {
        formik.setFieldValue(field, value);
    }, [formik]);


    const getBookingField = (field) => {
        const keys = field?.split(".");
        return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.values);
    };


    const getBookingError = (field) => {
        const keys = field?.split(".");
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
