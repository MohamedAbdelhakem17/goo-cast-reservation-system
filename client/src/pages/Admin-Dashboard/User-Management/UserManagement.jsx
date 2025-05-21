import { useState } from 'react'
import { motion } from 'framer-motion'
import { GetAllUser, MangeWorkSpace } from '../../../apis/user/user.api'
import Loading from '../../../components/shared/Loading/Loading'
import { useToast } from '../../../context/Toaster-Context/ToasterContext'
import useDateFormat from '../../../hooks/useDateFormat'
import Popup from '../../../components/shared/Popup/Popup'
import Input from '../../../components/shared/Input/Input'
import * as Yup from "yup"
import { useFormik } from 'formik'

const initialValue = {
    name: "",
    link: "",
}

const TABLE_HEAD = ["Name", "Email", "Created At", "Status", "Workspace", "Action"]

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    link: Yup.string().required("Link is required"),
})

export default function UserManagement() {
    const { data: userData, isLoading } = GetAllUser()
    const { mutate: mangeWorkSpace } = MangeWorkSpace()
    const { addToast } = useToast()
    const dateFormat = useDateFormat()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState(null)
    const [isAddOpen, setIsAddOpen] = useState(false)

    const filteredUsers = userData?.data?.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    const handleWorkspaceAction = (data, successMessage) => {
        mangeWorkSpace(data, {
            onSuccess: (res) => {
                addToast(res?.message || successMessage, "success");
                setIsAddOpen(false);
                formik.resetForm();
                formik.setSubmitting(false);
            },
            onError: ({ response }) => {
                addToast(response?.data?.message || "Something went wrong", "error");
                formik.setSubmitting(false);
            }
        });
    };

    const addWorkspace = (data) => handleWorkspaceAction(data, "Workspace added successfully")
    const editWorkspace = (data) => handleWorkspaceAction(data, "Workspace edited successfully")
    const deleteWorkspace = (data) => handleWorkspaceAction(data, "Workspace deleted successfully")

    const formik = useFormik({
        initialValues: initialValue,
        validationSchema,
        onSubmit: (values) => {
            if (selectedUser?.workspace) {
                editWorkspace({
                    user_id: selectedUser._id,
                    name: values.name,
                    link: values.link,
                    action: "update"
                })
            } else {
                addWorkspace({
                    user_id: selectedUser._id,
                    name: values.name,
                    link: values.link,
                    action: "add"
                })
            }
        },
    })

    if (isLoading) return
    <Loading />

    return (
        <>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className=" p-6">
                    <h2 className="text-2xl font-bold mb-4">User Management</h2>

                    <div className="relative mb-6 w-full max-w-xs">
                        <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 border border-main rounded-md w-full focus:outline-none focus:border-main-500 focus:ring-2-main"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>

                    <div className='bg-white rounded-xl shadow-lg overflow-hidden'>

                        <div className="overflow-x-auto">
                            <table className="w-full">

                                <thead className="bg-gray-50">
                                    <tr>
                                        {
                                            TABLE_HEAD.map((head, index) => (
                                                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{head}</th>
                                            ))
                                        }
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${user.active
                                                    ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                                    {user.active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{dateFormat(user.createdAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-2">
                                                    {user.workspace ? (
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <a href={user.workspace.link} target="_blank" rel="noopener noreferrer"
                                                                className="text-blue-500 text-sm underline break-all">
                                                                {user.workspace.name}
                                                            </a>

                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">No workspace</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-2 flex justify-center items-center gap-4">
                                                {
                                                    user.workspace
                                                        ? <><button onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsAddOpen(true)
                                                            formik.setValues({
                                                                name: user.workspace.name,
                                                                link: user.workspace.link
                                                            })
                                                        }}
                                                        >
                                                            <i className="fas fa-edit text-sm text-gray-600" />
                                                        </button>
                                                            <button onClick={() => deleteWorkspace({
                                                                user_id: user._id,
                                                                action: "delete"
                                                            })}
                                                            >
                                                                <i className="fas fa-trash text-sm text-red-500" />
                                                            </button>
                                                        </>
                                                        : <button onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsAddOpen(true)
                                                            formik.setValues({ name: "", link: "" })
                                                        }}
                                                            className="px-2 py-1 bg-main/90 text-white border border-main rounded
                                    text-sm"
                                                        >
                                                            <i className="fas fa-plus mr-1" /> Add Workspace
                                                        </button>
                                                }

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-6 text-gray-500">No users found</div>
                            )}
                        </div>

                    </div>

                </div>
            </motion.div>

            {isAddOpen && selectedUser && (
                <Popup>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">
                            {selectedUser.workspace ? "Edit" : "Add"} Workspace for {selectedUser.name}
                        </h3>
                        <i className="fa-solid fa-xmark cursor-pointer text-gray-500 hover:text-red-500 text-xl mx-4" onClick={() => {
                            setIsAddOpen(false)
                            formik.resetForm()
                        }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Provide a name and link for the workspace.</p>
                    <form onSubmit={formik.handleSubmit}>
                        <Input id="name" label="Workspace Name" value={formik.values.name} onChange={formik.handleChange}
                            onBlur={formik.handleBlur} errors={formik.errors.name} touched={formik.touched.name}
                            placeholder="Enter workspace name" />
                        <Input id="link" label="Link" value={formik.values.link} onChange={formik.handleChange}
                            onBlur={formik.handleBlur} errors={formik.errors.link} touched={formik.touched.link}
                            placeholder="Enter workspace link" />

                        <div className="flex justify-end mt-6">
                            <button type="submit" className="px-4 py-2 bg-main text-white rounded hover:opacity-90"
                                disabled={formik.isSubmitting}>
                                {formik.isSubmitting
                                    ? (selectedUser.workspace ? "Editing..." : "Adding...")
                                    : (selectedUser.workspace ? "Edit Workspace" : "Add Workspace")
                                }
                            </button>
                        </div>
                    </form>
                </Popup>
            )}
        </>
    )
}