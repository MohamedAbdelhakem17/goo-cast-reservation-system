import { useState } from "react";
import { motion } from "framer-motion";
import * as Yup from "yup";
import { useFormik } from "formik";
import {Input} from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { EditPassword } from "@/apis/user/user.api";

const initialValues = {
    currentPassword: "",
    password: "",
    confirmPassword: "",
};

const validationSchema = Yup.object({
    currentPassword: Yup.string()
        .required("Current password is required")
        .min(8, "Password must be at least 8 characters"),

    password: Yup.string()
        .required("New password is required")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/,
            "Password must be at least 8 characters and include uppercase, lowercase, number, and underscore"
        )
        .notOneOf([Yup.ref('currentPassword')], "New password must be different from current password"),

    confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref('password')], "Passwords must match"),
});


export default function EditUserPassword() {
    const { mutate: editPassword } = EditPassword()
    const [isOpen, setIsOpen] = useState(false);
    const { addToast } = useToast()
    const [serverError, setServerError] = useState(null);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            editPassword({ payload: values }, {
                onSuccess: (response) => {
                    addToast(response.message || 'Password changed successfully', 'success');
                    setTimeout(() => {
                        setIsOpen(false);
                        setServerError(null);
                    }, 2000);
                },
                onError: (error) => {
                    setServerError(error.response.data.message || 'Something went wrong');
                }
            })
        },
        enableReinitialize: true,
    });

    return (
        <>
            <button onClick={() => setIsOpen(true)}
                className="bg-main/90 hover:bg-main text-white shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2"
            >
                <i className="fa-solid fa-lock"></i>
                Change Password
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full mx-4">
                        <div className="bg-gradient-to-r from-main/90 to-main/80 p-6">
                            <h3 className="text-xl font-bold text-white">Change Password</h3>
                            <p className="text-indigo-100">
                                Enter your current password and a new password.
                            </p>
                        </div>
                        <form onSubmit={formik.handleSubmit} className="p-6">
                            <div className="space-y-6">
                                <Input type="password" label="Current Password" id="currentPassword"
                                    value={formik.values.currentPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    touched={formik.touched.currentPassword} errors={formik.errors.currentPassword} />

                                <Input type="password" label="New Password" id="password" value={formik.values.password}
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} touched={formik.touched.password}
                                    errors={formik.errors.password} />

                                <Input type="password" label="Confirm Password" id="confirmPassword"
                                    value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    touched={formik.touched.confirmPassword} errors={formik.errors.confirmPassword} />

                            </div>
                            {/* Error Message */}

                            {
                                serverError && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="mt-1 flex items-center space-x-1 text-sm text-red-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd" />
                                    </svg>
                                    <span>{serverError}</span>
                                </motion.div>
                            }

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => {
                                    setIsOpen(false);
                                    formik.resetForm();
                                    setServerError(null);
                                }}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-700
                                    hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="px-4 py-2 bg-main/90 border border-transparent rounded-md text-white hover:bg-main  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </>
    );
}