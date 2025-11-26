import { useGetAdmins } from "@/apis/admin/manage-admin.api";
import { ErrorFeedback, Loading } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { useState } from "react";
import AdminCard from "./_components/admin-card";
import AdminsForm from "./_components/admins-form";

export default function AdminManagement() {
  // Localization
  const { t } = useLocalization();

  // State
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Query
  const { admins, isLoading, error } = useGetAdmins();

  // Loading state
  if (isLoading) return <Loading />;

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center py-5">
        <ErrorFeedback>{error.message}</ErrorFeedback>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold">{t("admin-management")}</h1>
        <p className="text-gray-500">{t("mange-your-admins-in-system")}</p>
      </motion.div>

      {/* Content */}
      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-4">
        {/* Form  */}
        <div className="order-1 col-span-1 md:order-2">
          <AdminsForm
            editingAdmin={editingAdmin}
            onCancel={() => {
              setEditingAdmin(null);
            }}
          />
        </div>

        {/* Display Data */}
        <div className="order-2 col-span-1 grid grid-cols-1 gap-4 md:order-1 md:grid-cols-2 lg:col-span-3">
          {admins?.data?.map((admin) => (
            <AdminCard admin={admin} key={admin._id} />
          ))}
        </div>
      </section>
    </div>
  );
}
