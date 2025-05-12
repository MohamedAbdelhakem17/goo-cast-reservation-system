import { motion } from 'framer-motion';
export default function FavoriteStudio() {
    // This is sample data, in a real app it would come from a database
    const favoriteStudio = {
        name: "Creative Studio",
        bookingsCount: 12,
        lastBooking: "2 weeks ago",
        rating: 4.9,
        location: "New York",
        trend: "+20% from last year",
    }

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 h-full">
            <div className="bg-gradient-to-r from-rose-100 to-pink-100 border-b border-slate-100 p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Favorite Studio</h2>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-rose-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
            </div>
            <div className="p-6">
                <motion.div
                    className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-rose-500/10 to-transparent w-32 h-32 rounded-bl-full"></div>

                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{favoriteStudio.name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-slate-500"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span className="text-sm text-slate-500">{favoriteStudio.location}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-amber-500"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-indigo-500"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">Bookings</span>
                                </div>
                                <p className="text-xl font-bold text-slate-900">{favoriteStudio.bookingsCount}</p>
                                <p className="text-xs text-slate-500">Last visit: {favoriteStudio.lastBooking}</p>
                            </div>


                        </div>

                        <button className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            Book Again
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
