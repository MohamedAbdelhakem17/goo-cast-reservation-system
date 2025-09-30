import { motion } from "framer-motion";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useUpdateUserData } from "@/apis/users/user.api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function EditUserData({ user }) {
  // state
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // hooks
  const { updateUserData, error, isPending } = useUpdateUserData();
  const { addToast } = useToast();

  // Form and validation
  const formik = useFormik({
    initialValues: {
      name: user.name,
      phone: user.phone,
    },

    // validation schema
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      // phone: Yup.string().required('Phone is required')
    }),

    // handel submit
    onSubmit: (values) => {
      updateUserData(values, {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ["userData"] });

          addToast(res.message || "User data updated successfully", "success");

          setTimeout(() => {
            setIsOpen(false);
          }, 2000);
        },
      });
    },
  });

  return (
    <>
      {/* Edit button  */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 hover:shadow"
      >
        <i className="fa-solid fa-user"></i>
        Edit Profile
      </button>

      {isOpen && (
        // Modal
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            {/* Modal header */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50 p-6">
              <h3 className="text-xl font-bold text-slate-800">
                Edit Personal Information
              </h3>
              <p className="text-slate-500">
                Make changes to your personal information here.
              </p>
            </div>

            {/* Form  */}
            <form onSubmit={formik.handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* User name input */}
                <Input
                  id={"name"}
                  label={"Name"}
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  errors={formik.errors.name}
                  touched={formik.touched.name}
                />
                {/* User email input */}
                <Input
                  className="cursor-not-allowed text-slate-500"
                  disabled={true}
                  label="Email"
                  id="email"
                  type="email"
                  value={user.email}
                />
                {/* email feedback */}
                <p className="-mt-8 py-3 text-xs text-slate-500">
                  Contact support to change your email address
                </p>

                {/* user phone input */}
                <Input
                  id={"phone"}
                  label={"Phone"}
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  errors={formik.errors.phone}
                  touched={formik.touched.phone}
                />
              </div>

              {error && (
                //  Api feedback
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
                  disabled={isPending}
                  type="submit"
                  className="bg-main/90 hover:bg-main rounded-md border border-transparent px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  {isPending ? "updating .. " : " Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
