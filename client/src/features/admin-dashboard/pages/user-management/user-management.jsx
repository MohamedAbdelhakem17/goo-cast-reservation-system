import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Loading, ResponsiveTable } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import useUserManageWorkspace from "./_hooks/use-manage-workspace";
import { useGetAllUser } from "@/apis/admin/manage-user.api";
import { UsersTables, UsersFormModal, UserSearch } from "./_components";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import useDateFormat from "@/hooks/useDateFormat";
import { Edit, Trash2, TvMinimalPlay } from "lucide-react";
import useLocalization from "@/context/localization-provider/localization-context";

export default function UserManagement() {
  // localization
  const { t } = useLocalization();
  const { users, isLoading, error: getDataError } = useGetAllUser();
  const { addToast } = useToast();
  const dateFormat = useDateFormat();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddWorkSpaceOpen, setIsAddWorkSpaceOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { formik, handleWorkspaceAction, isPending } =
    useUserManageWorkspace(selectedUser);

  const filteredUsers = useMemo(() => {
    if (!users?.data) return [];

    return users.data.filter(
      (user) =>
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users?.data, searchTerm]);

  const deleteWorkspace = (user) => {
    if (!user?._id) return;

    handleWorkspaceAction({ user_id: user._id, action: "delete" }, formik, {
      onSuccess: () => {
        setIsAddWorkSpaceOpen(false);
        setSelectedUser(null);
        addToast(t("workspace-deleted-successfully"), "success");
      },
      onError: () => addToast(t("failed-to-delete-workspace"), "error"),
    });
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsAddWorkSpaceOpen(true);
    formik?.resetForm?.();
  };

  const handleCloseModal = () => {
    setIsAddWorkSpaceOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) return <Loading />;

  if (getDataError) {
    return (
      <div className="p-6">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          Error: {getDataError.message}
        </h2>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold">{t("user-management")}</h2>

          {/* Search */}
          <UserSearch setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

          {/* Content */}
          {isDesktop ? (
            <UsersTables
              users={filteredUsers}
              deleteWorkspace={deleteWorkspace}
              setSelectedUser={setSelectedUser}
              setIsAddWorkSpaceOpen={setIsAddWorkSpaceOpen}
            />
          ) : (
            <div className="space-y-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user._id || user.email}>
                    <ResponsiveTable
                      title={user.name || t("unknown-user")}
                      subtitle={user.active ? t("active-0") : t("inactive")}
                      actions={
                        <>
                          {user.workspace ? (
                            <>
                              {/* Edit */}
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsAddWorkSpaceOpen(true);
                                  formik.setValues({
                                    name: user.workspace.name,
                                    link: user.workspace.link,
                                  });
                                }}
                              >
                                <Edit className="text-sm text-blue-600" />
                              </button>

                              {/* Delete */}
                              <button onClick={() => deleteWorkspace(user)}>
                                <Trash2 className="text-sm text-red-500" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setIsAddWorkSpaceOpen(true);
                                formik.resetForm();
                              }}
                              className="bg-main/90 border-main rounded border px-2 py-1 text-sm text-white"
                            >
                              <TvMinimalPlay />
                            </button>
                          )}
                        </>
                      }
                      fields={[
                        {
                          label: t("workspace"),
                          value: user.workspace?.name || t("no-workspace"),
                        },
                        {
                          label: t("email"),
                          value: user.email || t("no-email"),
                        },
                        {
                          label: t("created-at"),
                          value: user.createdAt
                            ? dateFormat(user.createdAt)
                            : t("unknown"),
                        },
                      ]}
                    />
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  {t("no-users-found")}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      {isAddWorkSpaceOpen && selectedUser && (
        <UsersFormModal
          formik={formik}
          close={handleCloseModal}
          selectedUser={selectedUser}
          isLoading={isPending}
        />
      )}
    </>
  );
}
