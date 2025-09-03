import { motion } from "framer-motion"
import * as Yup from "yup";
import { useFormik } from "formik"
import {Input} from "@/components/common"

const initialValues = {
    name: "",
    minHours: "",
}

const validationSchema = Yup.object({
    name: Yup.string().required("Category name is required"),
    minHours: Yup.number().required("Minimum hours is required"),
})

export default function CategoryForm({ initialCategory, onSubmit, onCancel }) {

    const formik = useFormik({
        initialValues: initialCategory || initialValues,
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values)
        },
        enableReinitialize: true,
    })



    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={formik.handleSubmit}
            className="space-y-4"
        >


            <Input
                placeholder={"Enter category name"}
                id={"name"}
                label={"Category Name"}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors.name}
                touched={formik.touched.name}
                name={"name"}
                type={"text"}
            />

            <Input
                placeholder={"Enter minimum hours"}
                id={"minHours"}
                label={"Minimum Hours"}
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
                    className="flex-1 bg-main hover:bg-main/90 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                    <i className="fa-solid fa-plus mr-2 text-white"></i>
                    {initialCategory ? "Update" : "Save"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                    <i className="fa-solid fa-xmark mr-2 text-white"></i>
                    Cancel
                </button>
            </div>
        </motion.form>
    )
}
