import { motion } from "framer-motion";
import EditUserData from "./edit-user-data";
import EditUserPassword from "./edit-user-password";

export default function UserData({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="group"
    >
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
        {/* title */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-100 to-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
          <p className="text-slate-500">View and edit your personal information</p>
        </div>

        <div className="space-y-4 bg-white p-6">
          {/* User name */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 transition-colors duration-200 hover:bg-slate-100">
            <span className="font-medium text-slate-700">Name</span>
            <span className="font-semibold text-slate-900">{user?.name}</span>
          </div>

          {/* User email */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 transition-colors duration-200 hover:bg-slate-100">
            <span className="font-medium text-slate-700">Email</span>
            <span className="font-semibold text-slate-900">{user?.email}</span>
          </div>

          {/* User Phone */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 transition-colors duration-200 hover:bg-slate-100">
            <span className="font-medium text-slate-700">Phone</span>
            <span className="font-semibold text-slate-900">{user?.phone}</span>
          </div>

          {/* User Actions */}
          <div className="mt-6 flex justify-end gap-4">
            {/* Edit data */}
            <EditUserData user={user} />

            {/* Edit password */}
            <EditUserPassword />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
