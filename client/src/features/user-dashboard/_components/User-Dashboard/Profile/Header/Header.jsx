import { motion } from 'framer-motion'

export default function Header({ user, workspace }) {
    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-main/90 via-main to-main/50 p-8 mb-8 shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative z-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {user.name}
                    </h1>
                    <p className="text-white">Manage your profile and bookings</p>

                    {workspace && (
                        <p className="mt-2 text-white flex items-center gap-2">
                            <span className="font-bold text-xl ">Workspace:</span>
                            <a
                                href={workspace.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-white/50 px-3 py-1 rounded-lg underline-none hover:bg-white hover:text-main transition-all duration-200 shadow-sm max-w-xs truncate"
                                title={workspace.name}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-main">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.75h3.5v3.5m-9.5 9.5h-3.5v-3.5m12.25-6.75l-9.5 9.5" />
                                </svg>
                                <span className="truncate">{workspace.name}</span>
                            </a>
                        </p>
                    )}

                    <div className="flex items-center gap-2 mt-4">
                        <span className="bg-white/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                            <span className="h-1.5 w-1.5 bg-main rounded-full animate-pulse"></span>
                            <span>{user.active && "Active"}</span>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
