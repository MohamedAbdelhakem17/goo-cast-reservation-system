import { useState } from 'react'
import { motion } from 'framer-motion'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { UpdateUserData } from '../../../../apis/user/user.api'
import Input from '../../../shared/Input/Input'
import { useToast } from '../../../../context/Toaster-Context/ToasterContext'

export default function EditUserData({ user }) {
    const [isOpen, setIsOpen] = useState(false)
    const [serverError, setServerError] = useState(null)
    const { mutate: updateUserData } = UpdateUserData()
    const { addToast } = useToast()
    const initialValues = {
        name: user.name,
        phone: user.phone
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        // phone: Yup.string().required('Phone is required')
    })

    const onSubmit = (values) => {
        updateUserData({ payload: values }, {
            onSuccess: (res) => {
                addToast(res.message || 'User data updated successfully', 'success')
                setTimeout(() => {
                    setIsOpen(false)
                    setServerError(null)
                }, 2000)
            },
            onError: (error) => {
                setServerError(error.response?.data?.message || 'Something went wrong')
            }
        })
        setIsOpen(false)
    }


    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
    })



    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm hover:shadow transition-all duration-200 font-medium px-4 py-2 rounded-lg flex items-center gap-2"
            >
                <i className="fa-solid fa-user"></i>
                Edit Profile
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full mx-4"
                    >
                        <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-6 border-b border-slate-200">
                            <h3 className="text-xl font-bold text-slate-800">Edit Personal Information</h3>
                            <p className="text-slate-500">Make changes to your personal information here.</p>
                        </div>
                        <form onSubmit={formik.handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <Input
                                    id={"name"}
                                    label={"Name"}
                                    value={formik.values.name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    errors={formik.errors.name}
                                    touched={formik.touched.name}
                                />

                                <Input
                                    className=" text-slate-500 cursor-not-allowed"
                                    disabled={true}
                                    label="Email"
                                    id="email"
                                    type="email"
                                    value={user.email}
                                />
                                <p className="text-xs text-slate-500 -mt-8 py-3">Contact support to change your email address</p>

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
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false)
                                        formik.resetForm()
                                    }}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-main/90 border border-transparent rounded-md text-white hover:bg-main focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </>
    )
}
