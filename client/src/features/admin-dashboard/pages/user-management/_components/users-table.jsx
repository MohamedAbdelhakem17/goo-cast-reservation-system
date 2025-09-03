import { Table } from '@/components/common';
import useDateFormat from '@/hooks/useDateFormat';

const TABLE_HEAD = [
    "Name",
    "Email",
    "Created At",
    "Status",
    "Workspace",
    "Action",
];

export default function UsersTables(users, deleteWorkspace, setSelectedUser) {
    const dateFormat = useDateFormat();

    return <>
        <Table header={TABLE_HEAD}>
            {users?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`px-2 py-1 rounded text-xs font-medium ${user.active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {user.active ? "Active" : "Inactive"}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {dateFormat(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {user.workspace ? (
                            <a
                                href={user.workspace.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 text-sm underline break-all"
                            >
                                {user.workspace.name}
                            </a>
                        ) : (
                            <span className="text-sm text-gray-400">
                                No workspace
                            </span>
                        )}
                    </td>
                    <td className="p-2 flex justify-center items-center gap-4">
                        {user.workspace ? (
                            <>
                                {/* Edit */}
                                <button
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setIsAddOpen(true);
                                        formik.setValues({
                                            name: user.workspace.name,
                                            link: user.workspace.link,
                                        });
                                    }}
                                >
                                    <i className="fas fa-edit text-sm text-gray-600" />
                                </button>

                                {/* Delete */}
                                <button onClick={() => deleteWorkspace(user)}>
                                    <i className="fas fa-trash text-sm text-red-500" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    setSelectedUser(user);
                                    setIsAddOpen(true);
                                    formik.resetForm();
                                }}
                                className="px-2 py-1 bg-main/90 text-white border border-main rounded text-sm"
                            >
                                <i className="fas fa-plus mr-1" /> Add Workspace
                            </button>
                        )}
                    </td>
                </tr>
            ))}
        </Table>
        {users?.length === 0 && (
            <div className="text-center py-6 text-gray-500">
                No users found
            </div>
        )}
    </>
}
