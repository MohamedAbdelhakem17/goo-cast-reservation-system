import { useState } from "react";
import { motion } from "framer-motion";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useEditPassword } from "@/apis/users/user.api";

export default function EditUserPassword() {
  // state
  const [isOpen, setIsOpen] = useState(false);

  // mutation
  const { editUserPassword, error, isPending } = useEditPassword();

  // hooks
  const { addToast } = useToast();

  //   Form and validation
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
        "Password must be at least 8 characters and include uppercase, lowercase, number, and underscore",
      )
      .notOneOf(
        [Yup.ref("currentPassword")],
        "New password must be different from current password",
      ),

    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      editUserPassword(values, {
        onSuccess: (response) => {
          addToast(response.message || "Password changed successfully", "success");
          setTimeout(() => {
            setIsOpen(false);
          }, 2000);
        },
      });
    },
    enableReinitialize: true,
  });

  return (
    <>
      {/* Edit password button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-main/90 hover:bg-main flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow-md transition-all duration-200 hover:shadow-lg"
      >
        <i className="fa-solid fa-lock"></i>
        Change Password
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            {/* Modal header */}
            <div className="from-main/90 to-main/80 bg-gradient-to-r p-6">
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <p className="text-indigo-100">
                Enter your current password and a new password.
              </p>
            </div>

            {/* Form  */}
            <form onSubmit={formik.handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Current password input*/}
                <Input
                  type="password"
                  label="Current Password"
                  id="currentPassword"
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.currentPassword}
                  errors={formik.errors.currentPassword}
                />

                {/* New password input */}
                <Input
                  type="password"
                  label="New Password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.password}
                  errors={formik.errors.password}
                />

                {/* Confirm password input */}
                <Input
                  type="password"
                  label="Confirm Password"
                  id="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.confirmPassword}
                  errors={formik.errors.confirmPassword}
                />
              </div>

              {/* Api feedback */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="mt-1 flex items-center space-x-1 text-sm text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error.message}</span>
                </motion.div>
              )}

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                {/* Cancel button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    formik.resetForm();
                  }}
                  className="rounded-md border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  Cancel
                </button>

                {/* Save data button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-main/90 hover:bg-main rounded-md border border-transparent px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  {isPending ? "Changing .." : " Change Password"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
