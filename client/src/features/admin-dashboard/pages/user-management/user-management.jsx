import { useGetAllUserProfiles } from "@/apis/admin/manage-user.api";
import { Loading, ResponsiveTable } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import useDateFormat from "@/hooks/useDateFormat";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import usePriceFormat from "@/hooks/usePriceFormat";
import { motion } from "framer-motion";
import { MailPlus, Phone, Search, View } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { UsersFormModal, UsersTables } from "./_components";
import useUserManageWorkspace from "./_hooks/use-manage-workspace";

export default function UserManagement() {
  const { t } = useLocalization();
  const { users, isLoading, error: getDataError } = useGetAllUserProfiles();
  const { addToast } = useToast();
  const dateFormat = useDateFormat();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("fullName"); // name | email | phone
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddWorkSpaceOpen, setIsAddWorkSpaceOpen] = useState(false);

  const { formik, handleWorkspaceAction, isPending } =
    useUserManageWorkspace(selectedUser);

  const priceFormat = usePriceFormat();

  // ────────────────────────────────
  // Filtering Users
  // ────────────────────────────────
  const filteredUsers = useMemo(() => {
    if (!users?.data) return [];

    return users.data.filter((user) => {
      const value =
        (user?.[searchBy] || "").toString().toLowerCase() ||
        user?.workspace?.[searchBy]?.toLowerCase();
      return value?.includes(searchTerm.toLowerCase());
    });
  }, [users?.data, searchTerm, searchBy]);

  // ────────────────────────────────
  // Handlers
  // ────────────────────────────────
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

  // ────────────────────────────────
  // Loading & Error States
  // ────────────────────────────────
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

  // ────────────────────────────────
  // UI
  // ────────────────────────────────
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6 p-2 md:p-6">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold">{t("user-management")}</h2>

            {/* Search controls */}
            <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="focus:ring-main rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              >
                <option value="fullName">{t("search-by-name")}</option>
                <option value="email">{t("search-by-email")}</option>
                <option value="phone">{t("search-by-phone")}</option>
              </select>

              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("search-placeholder")}
                  className="focus:ring-main w-full rounded-lg border px-9 py-2 text-sm outline-none focus:ring-2"
                />
              </div>
            </div>
          </div>

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
                  <ResponsiveTable
                    key={user._id || user.email}
                    title={user.fullName || t("unknown-user")}
                    subTitle={
                      user.email ? (
                        <a
                          href={`mailto:${user.email}`}
                          className="hover:text-main inline-flex items-center gap-2 break-words text-gray-700 transition"
                        >
                          <MailPlus className="group-hover:text-main h-4 w-4 text-gray-400" />
                          <span className="block break-words">{user.email}</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">{t("no-email")}</span>
                      )
                    }
                    actions={
                      <Link
                        to={`${user._id}`}
                        className="text-main hover:text-main/80 inline-flex items-center gap-2 font-medium transition"
                      >
                        View
                        <View className="h-4 w-4" />
                      </Link>
                    }
                    fields={[
                      {
                        label: t("email"),
                        value: user.email ? (
                          <a
                            href={`mailto:${user.email}`}
                            className="hover:text-main inline-flex items-center gap-2 text-gray-700 transition"
                          >
                            <MailPlus className="group-hover:text-main h-4 w-4 text-gray-400" />
                            <span>{user.email}</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">{t("no-email")}</span>
                        ),
                      },
                      {
                        label: t("phone"),
                        value: user.phone ? (
                          <a
                            href={`tel:${user.phone}`}
                            className="hover:text-main inline-flex items-center gap-2 text-gray-700 transition"
                          >
                            <Phone className="group-hover:text-main h-4 w-4 text-gray-400" />
                            <span>{user.phone}</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">{t("no-phone")}</span>
                        ),
                      },
                      {
                        label: t("total-spent"),
                        value: priceFormat(user.userActivity.totalSpent),
                      },
                      {
                        label: t("booking-numbers"),
                        value: user.userActivity.totalBookingTimes,
                      },
                    ]}
                  />
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
