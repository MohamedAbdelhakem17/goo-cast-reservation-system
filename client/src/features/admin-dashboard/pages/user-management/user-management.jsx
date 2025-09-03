import { useState } from "react";
import { motion } from "framer-motion";
import { Loading } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import useUserManageWorkspace from "./_hooks/use-manage-workspace";
import { useGetAllUser } from "@/apis/admin/mange-user.api";
import { UsersTables, UsersFormModal, UserSearch } from "./_components"


export default function UserManagement() {
	const { users, isLoading, error: getDataError } = useGetAllUser();
	const { addToast } = useToast();

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [isAddOpen, setIsAddOpen] = useState(false);

	const { formik, handleWorkspaceAction, isPending } =
		useUserManageWorkspace(selectedUser);

	if (isLoading) return <Loading />;

	const filteredUsers = users?.data?.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const deleteWorkspace = (user) => {
		handleWorkspaceAction({ user_id: user._id, action: "delete" }, formik, {
			onSuccess: () => addToast("Workspace deleted successfully", "success"),
			onError: () => addToast("Failed to delete workspace", "error"),
		});
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">User Management</h2>

					{/* Search */}
					<UserSearch setSearchTerm={setSearchTerm} searchTerm={searchTerm} />


					{/* Table */}
					{getDataError
						? <h2>{getDataError.message}</h2>
						: <UsersTables users={filteredUsers} deleteWorkspace={deleteWorkspace} setSelectedUser={setSelectedUser} />
					}

				</div>
			</motion.div>

			{/* Popup */}
			{isAddOpen && selectedUser && (<UsersFormModal formik={formik} close={setIsAddOpen(false)} selectedUser={selectedUser} isLoading={isPending} />)}
		</>
	);
}
