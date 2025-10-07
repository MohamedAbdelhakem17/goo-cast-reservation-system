import { motion } from "framer-motion";
import { useChangeAdminsStatus } from "@/apis/admin/manage-admin.api";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";
import useLocalization from "@/context/localization-provider/localization-context";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-5 shadow-md transition-all duration-200 hover:shadow-lg ${
        admin.active ? "border-red-300 bg-white" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        {/* Name and Email */}
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
        </div>

        {/* Status with Dot */}
        <div
          className={`"\py-.5 flex items-center gap-2 rounded-md border ${admin.active ? "border-red-500" : "border-gray-500"} px-2`}
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
          <i className="fa-solid fa-spinner fa-spin me-2"></i>
        ) : (
          <i
            className={`fa-solid ${
              admin.active ? "fa-user-slash" : "fa-user-check"
            } me-2`}
          ></i>
        )}
        {admin.active ? "Deactivate Admin" : "Activate Admin"}
      </button>
    </motion.div>
  );
}
