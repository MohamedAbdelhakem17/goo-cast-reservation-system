import { motion } from "framer-motion";
import useQuickBooking from "@/hooks/useQuickBooking";
export default function FavoriteStudio({ favoriteStudio, favoritePackage }) {
  const { handleQuickBooking } = useQuickBooking();
  return (
    <div className="h-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="border-b border-slate-100 bg-gradient-to-r from-rose-100 to-pink-100 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Favorite Booking</h2>
          <i className="fa-solid fa-heart text-rose-500"></i>
        </div>
      </div>

      <div className="px-3 py-1">
        {/* Favorite Studio */}
        <motion.div
          className="relative mb-5 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-2 shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-bl from-rose-500/10 to-transparent"></div>

          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {favoriteStudio.name}
                </h3>
                <div className="mt-1 flex items-center gap-1">
                  <i className="fa-solid fa-location-dot mr-2 text-sm text-slate-400"></i>
                  <span className="text-sm text-slate-500">
                    {favoriteStudio.location}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div>
                    <i className="fa-solid fa-calendar-days text-rose-500"></i>
                    <span className="ml-2 text-sm font-medium text-slate-700">
                      Bookings
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">
                    {favoriteStudio.count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Favorite Package */}
        <motion.div
          className="relative overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-bl from-rose-500/10 to-transparent"></div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {favoritePackage.packageName}
                </h3>
                <p>{favoritePackage.packageCategory}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div>
                    <i className="fa-solid fa-calendar-days text-rose-500"></i>
                    <span className="ml-2 text-sm font-medium text-slate-700">
                      Bookings
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">
                    {favoriteStudio.count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => handleQuickBooking()}
          className="my-5 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-50 px-4 py-3 font-medium text-rose-600 transition-colors duration-200 hover:bg-rose-100"
        >
          <i className="fa-solid fa-heart text-rose-500"></i>
          Book Again
        </button>
      </div>
    </div>
  );
}
