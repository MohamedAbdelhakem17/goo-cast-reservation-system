import { useCreateAdmin } from "@/apis/admin/manage-admin.api";
import { Input, SelectInput } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import SYSTEM_ROLES from "@/utils/constant/system-roles.constant";
import useAdminSchema from "@/utils/schemas/admins-schema";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from "react";

export default function AdminsForm({ editingAdmin, onCancel }) {
  // Localizations
  const { t } = useLocalization();

  // State
  const [isFormOpen, setIsFormOpen] = useState(!!editingAdmin);

  // Mutation
  const { createAdmin, isPending } = useCreateAdmin();

  // Hooks
  const { getInitialValues, validationSchema } = useAdminSchema();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Functions
  const handelAddAdmin = (values) => {
    createAdmin(values, {
      onSuccess: (response) => {
        console.log(response);
        addToast(response?.data, "success");
        setIsFormOpen(null);
        formik.resetForm();
        queryClient.invalidateQueries({ queryKey: ["admins"] });
      },

      onError: (error) => {
        const errorMessage = error?.response?.data?.message;

        addToast(errorMessage, "error");
      },
    });
    queryClient.invalidateQueries({ queryKey: ["admins"] });
  };

  // Form and Validation
  const formik = useFormik({
    initialValues: getInitialValues(editingAdmin),
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (editingAdmin) {
        // Editing case
        console.log(values);
      } else {
        // Adding Case
        handelAddAdmin(values);
      }
    },
  });

  // Variables
  const rolesOptions = Object.values(SYSTEM_ROLES).map((item) => {
    return {
      label: item,
      value: item,
    };
  });
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="border-main mb-5 border-b p-4">
          <h2 className="text-xl font-semibold">
            {editingAdmin ? t("edit-admin-data") : t("add-admin")}
          </h2>
        </div>

        {/* Form and Add Button */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {/* Form display */}
            {isFormOpen && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={formik.handleSubmit}
                className="space-y-4 px-2"
              >
                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Input
                    type="text"
                    id="name"
                    label={t("full-name")}
                    placeholder={t("enter-your-name")}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors.name}
                    touched={formik.touched.name}
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                >
                  <Input
                    type="email"
                    id="email"
                    label={t("email")}
                    placeholder={t("enter-your-email")}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors.email}
                    touched={formik.touched.email}
                  />
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <Input
                    type="password"
                    id="password"
                    label={t("password")}
                    isPasswordField
                    placeholder={t("enter-your-password")}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors.password}
                    touched={formik.touched.password}
                  />
                </motion.div>

                {/* Confirm Password */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                >
                  <Input
                    type="password"
                    id="confirmPassword"
                    label={t("confirm-password")}
                    placeholder={t("re-enter-your-password")}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors.confirmPassword}
                    touched={formik.touched.confirmPassword}
                  />
                </motion.div>

                {/* User Role */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                >
                  <SelectInput
                    name="role"
                    value={formik.values.role}
                    onChange={(e) => formik.setFieldValue("role", e.target.value)}
                    options={rolesOptions}
                    placeholder={"Select user role"}
                    className="col-span-1 md:col-span-2"
                  />
                </motion.div>

                <div className="flex space-x-2 pt-2">
                  <button
                    disabled={isPending}
                    type="submit"
                    className="bg-main hover:bg-main/90 flex flex-1 items-center justify-center rounded-md px-4 py-2 text-white transition-colors disabled:bg-gray-200 disabled:text-gray-500"
                  >
                    {isPending ? (
                      <Loader className="me-2 animate-spin text-gray-800" />
                    ) : (
                      <i className="fa-solid fa-plus me-2 text-white"></i>
                    )}
                    {editingAdmin ? t("update") : t("save")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      formik.resetForm();
                      setIsFormOpen(false);
                    }}
                    className="flex flex-1 items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <i className="fa-solid fa-xmark me-2 text-white"></i>
                    {t("cancel")}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Button display  */}
            {!isFormOpen && (
              <motion.div
                key="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-main hover:bg-main/90 flex w-full items-center justify-center rounded-md px-4 py-2 text-white transition-colors"
                >
                  <i className="fa-solid fa-plus me-2 text-white"></i>
                  {t("add-new-admin")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
