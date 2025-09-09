import { motion } from "framer-motion";

export default function Header({ user, workspace }) {
  return (
    <motion.div
      className="from-main/90 via-main to-main/50 relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r p-8 shadow-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            Welcome back, {user.name}
          </h1>
          <p className="text-white">Manage your profile and bookings</p>

          {workspace && (
            <p className="mt-2 flex items-center gap-2 text-white">
              <span className="text-xl font-bold">Workspace:</span>
              <a
                href={workspace.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-none hover:text-main inline-flex max-w-xs items-center gap-1 truncate rounded-lg bg-white/50 px-3 py-1 shadow-sm transition-all duration-200 hover:bg-white"
                title={workspace.name}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="text-main h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12.75 3.75h3.5v3.5m-9.5 9.5h-3.5v-3.5m12.25-6.75l-9.5 9.5"
                  />
                </svg>
                <span className="truncate">{workspace.name}</span>
              </a>
            </p>
          )}

          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-white/50 px-3 py-1 text-xs text-white backdrop-blur-md">
              <span className="bg-main h-1.5 w-1.5 animate-pulse rounded-full"></span>
              <span>{user.active && "Active"}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
