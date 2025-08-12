import { motion } from 'framer-motion'
import EditUserData from '../Edit-User-Data/EditUserData'
import EditUserPassword from '../Edit-User-Password/EditUserPassword'

export default function UserData({ user }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group"
        >
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-100 p-6">
                    <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                    <p className="text-slate-500">View and edit your personal information</p>
                </div>
                <div className="space-y-4 p-6 bg-white">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                        <span className="font-medium text-slate-700">Name</span>
                        <span className="text-slate-900 font-semibold">{user?.name}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                        <span className="font-medium text-slate-700">Email</span>
                        <span className="text-slate-900 font-semibold">{user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                        <span className="font-medium text-slate-700">Phone</span>
                        <span className="text-slate-900 font-semibold">{user?.phone}</span>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <EditUserData user={user} />
                        <EditUserPassword />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
