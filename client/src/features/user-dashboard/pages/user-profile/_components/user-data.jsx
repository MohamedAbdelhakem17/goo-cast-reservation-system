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
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
        {/* title */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800">
            Personal Information
          </h2>
          <p className="text-slate-500">
            View and edit your personal information
          </p>
        </div>

        <div className="space-y-4 p-6 bg-white">
          {/* User name */}
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
            <span className="font-medium text-slate-700">Name</span>
            <span className="text-slate-900 font-semibold">{user?.name}</span>
          </div>

          {/* User email */}
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
            <span className="font-medium text-slate-700">Email</span>
            <span className="text-slate-900 font-semibold">{user?.email}</span>
          </div>

          {/* User Phone */}
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
            <span className="font-medium text-slate-700">Phone</span>
            <span className="text-slate-900 font-semibold">{user?.phone}</span>
          </div>

          {/* User Actions */}
          <div className="flex justify-end gap-4 mt-6">
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
