import { useState } from "react"
import { motion } from "framer-motion"
import { GetAllCoupons, CreateNewCoupon, UpdateCoupon, DeleteCoupon } from "../../../../apis/coupon/coupon"
import { useAnimationVariants } from "../../../../hooks/useAnimationVariants"
import { Pencil, Trash2, Plus, X, Tag, Calendar, Hash, Percent, RefreshCw } from "lucide-react"
import Table from "../../../../components/shared/Table/Table"
import Loading from "../../../../components/shared/Loading/Loading"

const TABLE_HEADERS = ["NAME", "CODE", "DISCOUNT", "EXPIRES AT", "MAX USES", "ACTIONS"]

export default function CouponManagement() {
    const { slideIn } = useAnimationVariants()
    const { data, isLoading, error } = GetAllCoupons()
    const { mutate: createCoupon, isLoading: isCreating } = CreateNewCoupon()
    const { mutate: updateCoupon, isLoading: isUpdating } = UpdateCoupon()
    const { mutate: deleteCoupon, isLoading: isDeleting } = DeleteCoupon()
    const [editingCoupon, setEditingCoupon] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [couponToDelete, setCouponToDelete] = useState(null)
    const [toast, setToast] = useState({ show: false, title: "", message: "", type: "" })

    const [form, setForm] = useState({
        name: "",
        code: "",
        discount: "",
        expires_at: "",
        max_uses: "",
    })

    // Handle form input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Show toast notification
    const showToast = (title, message, type = "success") => {
        setToast({ show: true, title, message, type })
        setTimeout(() => setToast({ show: false, title: "", message: "", type: "" }), 3000)
    }

    // Handle create or update
    const handleSubmit = (e) => {
        e.preventDefault()

        if (editingCoupon) {
            updateCoupon(
                { id: editingCoupon._id, payload: form },
                {
                    onSuccess: () => {
                        setEditingCoupon(null)
                        setForm({ name: "", code: "", discount: "", expires_at: "", max_uses: "" })
                        showToast("Coupon updated", `Coupon ${form.name} has been updated successfully.`)
                    },
                    onError: () => {
                        showToast("Error", "Failed to update coupon. Please try again.", "error")
                    },
                },
            )
        } else {
            createCoupon(form, {
                onSuccess: () => {
                    setForm({ name: "", code: "", discount: "", expires_at: "", max_uses: "" })
                    showToast("Coupon created", `Coupon ${form.name} has been created successfully.`)
                },
                onError: () => {
                    showToast("Error", "Failed to create coupon. Please try again.", "error")
                },
            })
        }
    }

    // Handle edit
    const handleEdit = (coupon) => {
        setEditingCoupon(coupon)
        setForm({
            name: coupon.name,
            code: coupon.code?.toUpperCase(),
            discount: coupon.discount,
            expires_at: coupon.expires_at?.slice(0, 10),
            max_uses: coupon.max_uses,
        })
    }

    // Handle delete confirmation
    const handleDeleteConfirm = (coupon) => {
        setCouponToDelete(coupon)
        setDeleteDialogOpen(true)
    }

    // Handle delete
    const handleDelete = () => {
        deleteCoupon(
            { id: couponToDelete._id },
            {
                onSuccess: () => {
                    setEditingCoupon(null)
                    setForm({ name: "", code: "", discount: "", expires_at: "", max_uses: "" })
                    showToast("Coupon deleted", `Coupon ${couponToDelete.name} has been deleted successfully.`)
                },
                onError: () => {
                    showToast("Error", "Failed to delete coupon. Please try again.", "error")
                },
            },
        )
        setDeleteDialogOpen(false)
    }

    // Reset form
    const resetForm = () => {
        setEditingCoupon(null)
        setForm({ name: "", code: "", discount: "", expires_at: "", max_uses: "" })
    }

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Check if coupon is expired
    const isExpired = (dateString) => {
        if (!dateString) return false
        const expiryDate = new Date(dateString)
        return expiryDate < new Date()
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideIn}
            className="p-4 md:p-6  mx-auto space-y-8"
        >
            {/* Toast notification */}
            {toast.show && (
                <div
                    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transform transition-transform duration-300 ease-in-out ${toast.type === "error"
                        ? "bg-red-50 border border-red-200 text-red-700"
                        : "bg-green-50 border border-green-200 text-green-700"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{toast.title}</h3>
                        <button
                            onClick={() => setToast({ show: false, title: "", message: "", type: "" })}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="mt-1 text-sm">{toast.message}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Coupon Management</h2>
                    <p className="text-gray-500 mt-1">Create and manage discount coupons for your customers</p>
                </div>
            </div>

            {/* Create/Edit Coupon Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="pb-3 border-b border-gray-100 mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        {editingCoupon ? (
                            <>
                                <Pencil className="h-5 w-5 text-amber-500" />
                                Edit Coupon
                            </>
                        ) : (
                            <>
                                <Plus className="h-5 w-5 text-emerald-500" />
                                Create New Coupon
                            </>
                        )}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                        {editingCoupon
                            ? `Editing coupon: ${editingCoupon.name}`
                            : "Fill in the details to create a new discount coupon"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className=" text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                <Tag className="h-4 w-4" />
                                Coupon Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Summer Sale"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="code" className=" text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                <Hash className="h-4 w-4" />
                                Coupon Code
                            </label>
                            <input
                                id="code"
                                name="code"
                                value={form.code?.toUpperCase()}
                                onChange={handleChange}
                                placeholder="SUMMER20"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="discount" className=" text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                <Percent className="h-4 w-4" />
                                Discount (%)
                            </label>
                            <input
                                id="discount"
                                name="discount"
                                value={form.discount}
                                onChange={handleChange}
                                placeholder="20"
                                type="number"
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="expires_at" className=" text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                Expiry Date
                            </label>
                            <input
                                id="expires_at"
                                name="expires_at"
                                value={form.expires_at}
                                onChange={handleChange}
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="max_uses" className=" text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                <RefreshCw className="h-4 w-4" />
                                Max Uses
                            </label>
                            <input
                                id="max_uses"
                                name="max_uses"
                                value={form.max_uses}
                                onChange={handleChange}
                                placeholder="100"
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded-md text-white font-medium flex items-center ${editingCoupon
                                ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
                                : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                            disabled={isCreating || isUpdating}
                        >
                            {(isCreating || isUpdating) && (
                                <svg
                                    className="mr-2 h-4 w-4 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            )}
                            {editingCoupon ? "Update Coupon" : "Create Coupon"}
                        </button>

                        {editingCoupon && (
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"
                                onClick={resetForm}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Coupon List */}
            <div className="bg-white  p-6 border border-gray-100">
                <div className="pb-3 border-b border-gray-100 mb-6">
                    <h3 className="text-xl font-semibold">Available Coupons</h3>
                    <p className="text-gray-500 text-sm mt-1">Manage your existing discount coupons</p>
                </div>

                {isLoading ? (<Loading />) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center">
                        <p>Error loading coupons. Please try refreshing the page.</p>
                    </div>
                ) : (
                    <Table headers={TABLE_HEADERS}>
                        {data?.data?.length === 0 ? (
                            <td colSpan={6} className="px-6 py-10 text-center text-gray-400" >
                                No coupons found. Create your first coupon above.
                            </td>
                        ) :
                            data?.data?.map((coupon) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="hover:bg-gray-50 [&_td]:px-6 [&_td]:py-4 [&_td]:whitespace-nowrap"
                                    key={coupon._id}
                                >
                                    <td >{coupon.name}</td>
                                    <td >
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 font-mono uppercase">
                                            {coupon.code}
                                        </span>
                                    </td>
                                    <td >
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                                            {coupon.discount}%
                                        </span>
                                    </td>
                                    <td >
                                        {isExpired(coupon.expires_at) ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700">
                                                Expired
                                            </span>
                                        ) : (
                                            <span className="text-sm">{formatDate(coupon.expires_at)}</span>
                                        )}
                                    </td>
                                    <td >{coupon.max_uses}</td>
                                    <td>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(coupon)}
                                                className="text-amber-600 hover:text-amber-900 p-1 rounded-full hover:bg-amber-50"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteConfirm(coupon)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                    </Table>

                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {
                deleteDialogOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                &#8203;
                            </span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <Trash2 className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Are you sure?</h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    This will permanently delete the coupon{" "}
                                                    <span className="font-semibold">{couponToDelete?.name}</span> with code{" "}
                                                    <span className="font-mono font-semibold">{couponToDelete?.code}</span>. This action cannot be
                                                    undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleDelete}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg
                                                    className="mr-2 h-4 w-4 animate-spin"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete"
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setDeleteDialogOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </motion.div >
    )
}
