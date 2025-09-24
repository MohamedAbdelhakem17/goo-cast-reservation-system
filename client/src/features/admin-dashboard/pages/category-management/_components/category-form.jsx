import { motion } from "framer-motion";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import {
  categoryValidationSchema,
  initialCategoryValues,
} from "@/utils/schemas/category.schema";

export default function CategoryForm({ initialCategory, onSubmit, onCancel }) {
  // Localization
  const { t } = useLocalization();

  // Form and validation
  const formik = useFormik({
    initialValues: initialCategory || initialCategoryValues,
    validationSchema: categoryValidationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={formik.handleSubmit}
      className="space-y-4 px-2"
    >
      <Input
        placeholder={t("enter-english-category-name")}
        id={"name.en"}
        label={t("category-english-name")}
        value={formik.values.name?.en}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors.name?.en}
        touched={formik.touched.name?.en}
        name={"name.en"}
        type={"text"}
      />

      <Input
        placeholder={t("enter-arabic-category-name")}
        id={"name.ar"}
        label={t("category-arabic-name")}
        value={formik.values.name?.ar}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors.name?.ar}
        touched={formik.touched.name?.ar}
        name={"name.ar"}
        type={"text"}
      />

      <Input
        placeholder={t("enter-minimum-hours")}
        id={"minHours"}
        label={t("minimum-hours")}
        value={formik.values.minHours}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors.minHours}
        touched={formik.touched.minHours}
        name={"minHours"}
        type={"number"}
      />

      <div className="flex space-x-2 pt-2">
        <button
          type="submit"
          className="bg-main hover:bg-main/90 flex flex-1 items-center justify-center rounded-md px-4 py-2 text-white transition-colors"
        >
          <i className="fa-solid fa-plus me-2 text-white"></i>
          {initialCategory ? t("update") : t("save")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex flex-1 items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <i className="fa-solid fa-xmark me-2 text-white"></i>
          {t("cancel")}
        </button>
      </div>
    </motion.form>
  );
}
