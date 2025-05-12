import { motion } from 'framer-motion';
import useQuickBooking from '../../../../hooks/useQuickBooking';
export default function FavoriteStudio({ favoriteStudio, favoritePackage }) {
    const { handleQuickBooking } = useQuickBooking()
    return (
        <div
            className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 h-full">
            <div className="bg-gradient-to-r from-rose-100 to-pink-100 border-b border-slate-100 p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Favorite Booking</h2>
                    <i className="fa-solid fa-heart text-rose-500"></i>
                </div>
            </div>

            <div className="py-1 px-3">
                {/* Favorite Studio */}
                <motion.div
                    className="bg-gradient-to-br from-slate-50 to-white px-6 py-2 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden mb-5"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}>
                    <div
                        className="absolute top-0 right-0 bg-gradient-to-bl from-rose-500/10 to-transparent w-32 h-32 rounded-bl-full">
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{favoriteStudio.name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <i className="fa-solid fa-location-dot text-slate-400 mr-2 text-sm"></i>
                                    <span className="text-sm text-slate-500">{favoriteStudio.location}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <i className="fa-solid fa-star text-yellow-400"></i>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <i className="fa-solid fa-calendar-days  text-indigo-500"></i>
                                    <span className="text-sm font-medium text-slate-700">Bookings</span>
                                </div>
                                <p className="text-xl font-bold text-slate-900">{favoriteStudio.count}</p>
                            </div>

                        </div>

                    </div>
                </motion.div>
                {/* Favorite Package */}
                <motion.div
                    className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}>
                    <div
                        className="absolute top-0 right-0 bg-gradient-to-bl from-rose-500/10 to-transparent w-32 h-32 rounded-bl-full">
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{favoritePackage.packageName}</h3>
                                <p>{favoritePackage.packageCategory}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <i className="fa-solid fa-star text-yellow-400"></i>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <i className="fa-solid fa-calendar-days  text-indigo-500"></i>
                                    <span className="text-sm font-medium text-slate-700">Bookings</span>
                                </div>
                                <p className="text-xl font-bold text-slate-900">{favoriteStudio.count}</p>
                            </div>

                        </div>

                    
                    </div>
                </motion.div>

                  <button onClick={() => handleQuickBooking()}
                            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium py-3 px-4 rounded-lg flex my-5
                    items-center justify-center gap-2 transition-colors duration-200">
                            <i className="fa-solid fa-heart text-rose-500"></i>
                            Book Again
                        </button>
            </div>
        </div>
    )
}