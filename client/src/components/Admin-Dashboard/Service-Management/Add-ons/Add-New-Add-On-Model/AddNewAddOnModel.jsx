import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import Input from '../../../../shared/Input/Input'
import Alert from '../../../../shared/Alert/Alert'
import { AddNewAddOn } from '../../../../../apis/services/services.api'
import { useToast } from '../../../../../context/Toaster-Context/ToasterContext'

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Add-on name is required')
        .min(3, 'Name must be at least 3 characters'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
    price: Yup.number()
        .required('Price is required')
        .positive('Price must be positive'),
    icon: Yup.string()
        .required('Icon is required')
})

export default function AddNewAddOnModel({ closeModel }) {

    const { mutate: addNewAddOn, isLoading } = AddNewAddOn()
    const { addToast } = useToast()

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: '',
            icon: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            addNewAddOn(values, {
                onSuccess: () => {
                    addToast('Add-on added successfully', 'success')
                    closeModel()
                },
                onError: (error) => {
                    addToast(error.message || 'Something went wrong', 'error')
                }
            })
        }
    })

    return (
        <>


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md w-1/2"
            >
                <div className='flex justify-between items-center mb-6'>
                    <h2 className="text-2xl font-semibold text-gray-800 ">Add New Add-On</h2>
                    <span className='h-6 text-white bg-main w-6 rounded-full flex justify-center items-center cursor-pointer' onClick={closeModel}>
                        <i className="fa-solid fa-xmark " ></i>
                    </span>
                </div>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <Input
                        label="Name"
                        id="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errors={formik.touched.name && formik.errors.name}
                        touched={formik.touched.name}
                        placeholder="Enter add-on name"
                    />

                    <Input
                        label="Description"
                        id="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errors={formik.touched.description && formik.errors.description}
                        touched={formik.touched.description}
                        placeholder="Enter add-on description"
                    />

                    <Input
                        label="Price"
                        id="price"
                        type="number"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errors={formik.touched.price && formik.errors.price}
                        touched={formik.touched.price}
                        placeholder="Enter add-on price"
                    />

                    <Input
                        label="Icon"
                        id="icon"
                        value={formik.values.icon}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errors={formik.touched.icon && formik.errors.icon}
                        touched={formik.touched.icon}
                        placeholder="Enter icon class (e.g., fa-solid fa-camera)"
                    />

                    <motion.button
                        type="submit"
                        disabled={!formik.isValid || isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-main text-white py-3 rounded-md font-medium hover:bg-main/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {formik.isSubmitting ? 'Adding...' : 'Add Add-On'}
                    </motion.button>
                </form>
            </motion.div>
        </>
    )
}
