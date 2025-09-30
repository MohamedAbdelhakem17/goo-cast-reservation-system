
import { Popup, Input } from '@/components/common';

export default function UsersFormModal({ formik, close, selectedUser, isLoading }) {
    return (
        <Popup>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                    {selectedUser.workspace ? "Edit" : "Add"} Workspace for{" "}
                    {selectedUser.name}
                </h3>
                <i
                    className="fa-solid fa-xmark cursor-pointer text-gray-500 hover:text-red-500 text-xl mx-4"
                    onClick={() => {
                        close();
                        formik.resetForm();
                    }}
                />
            </div>

            <form onSubmit={formik.handleSubmit}>
                <Input
                    id="name"
                    label="Workspace Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors.name}
                    touched={formik.touched.name}
                    placeholder="Enter workspace name"
                />
                <Input
                    id="link"
                    label="Workspace Link"
                    value={formik.values.link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors.link}
                    touched={formik.touched.link}
                    placeholder="Enter workspace link"
                />

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-main text-white rounded hover:opacity-90"
                        disabled={formik.isSubmitting || isLoading}
                    >
                        {formik.isSubmitting
                            ? selectedUser.workspace
                                ? "Editing..."
                                : "Adding..."
                            : selectedUser.workspace
                                ? "Edit Workspace"
                                : "Add Workspace"}
                    </button>
                </div>
            </form>
        </Popup>
    )
}
