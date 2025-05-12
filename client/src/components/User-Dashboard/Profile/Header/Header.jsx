import { motion } from 'framer-motion'
export default function Header({userName}) {
    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-main/90 via-main to-main/50 p-8 mb-8 shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative z-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userName}</h1>
                    <p className="text-white">Manage your profile and bookings</p>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="bg-white/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                            <span className="h-1.5 w-1.5 bg-main rounded-full animate-pulse"></span>
                            <span>Active</span>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>

    )
}
