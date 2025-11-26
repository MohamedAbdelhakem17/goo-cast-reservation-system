import { useChangeAdminsStatus } from "@/apis/admin/manage-admin.api";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Shield, User, UserCheck, UserCheck2, UserMinus } from "lucide-react";

export default function AdminCard({ admin }) {
  // Localizations
  const { t } = useLocalization();

  // Mutation
  const { changeStatus, isPending } = useChangeAdminsStatus();

  // Hooks
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // functions
  const handleChangeStatus = (id, newStatus) => {
    changeStatus(
      { id, payload: newStatus },
      {
        onSuccess: () => {
          addToast(t("change-status-successfully"), "success");
          queryClient.invalidateQueries({ queryKey: ["admins"] });
        },
        onError: (error) => {
          addToast(t("failed-to-change-status"), "error");
          console.error("Change status error:", error);
        },
      },
    );
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "Manager":
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-5 shadow-md transition-all duration-200 hover:shadow-lg ${
        admin.active ? "border-red-300 bg-white" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        {/* Name, Email and Role */}
        <div>
          <h3
            className={`text-lg font-semibold ${
              admin.active ? "text-red-600" : "text-gray-700"
            }`}
          >
            {admin.name}
          </h3>
          <a
            href={`mailto:${admin.email}`}
            className="text-sm text-gray-400 hover:underline"
          >
            {admin.email}
          </a>
          {/* User Role with Lucide Icon */}
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            {getRoleIcon(admin.role)}
            {admin.role}
          </p>
        </div>

        {/* Status with Dot */}
        <div
          className={`flex items-center gap-2 rounded-md border px-2 py-0.5 ${
            admin.active ? "border-red-500" : "border-gray-500"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              admin.active ? "bg-red-500" : "bg-gray-400"
            }`}
          ></span>
          <span
            className={`text-sm font-medium ${
              admin.active ? "text-red-600" : "text-gray-500"
            }`}
          >
            {admin.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => handleChangeStatus(admin._id, !admin.active)}
        disabled={isPending}
        className={`mt-2 flex w-full items-center justify-center rounded-md py-3 font-medium text-white transition-colors ${
          admin.active ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"
        } ${isPending ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {isPending ? (
          <User className="me-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            {admin.active ? (
              <UserMinus className="me-2 h-4 w-4" />
            ) : (
              <UserCheck2 className="me-2 h-4 w-4" />
            )}
          </>
        )}
        {admin.active ? "Deactivate Admin" : "Activate Admin"}
      </button>
    </motion.div>
  );
}
