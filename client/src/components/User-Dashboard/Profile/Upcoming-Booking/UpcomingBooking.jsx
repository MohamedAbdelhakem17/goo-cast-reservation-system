import { motion } from "framer-motion";
import useDateFormat from "../../../../hooks/useDateFormat";
import usePriceFormat from "../../../../hooks/usePriceFormat";
import useTimeConvert from "../../../../hooks/useTimeConvert";
export default function UpcomingBooking({ data , label }) {
    const formatDate = useDateFormat()
    const formatPrice = usePriceFormat()
    const timeConvert = useTimeConvert()

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 h-full">
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-100 p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{label}</h2>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {data.status}
                    </span>
                </div>
            </div>
            <div className="p-6 space-y-6">
                <motion.div
                    className="flex justify-between items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full h-8 w-8 flex items-center justify-center">
                            <i className="fa-solid fa-location-dot text-indigo-600"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Studio</p>
                            <p className="font-medium text-slate-800">{data.studioName}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <i className="fa-solid fa-star text-yellow-500"></i>
                    </div>
                </motion.div>
                <motion.div
                    className="flex justify-between items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full h-8 w-8 flex items-center justify-center">
                            <i className="fa-solid fa-boxes-stacked text-indigo-600"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Package</p>
                            <p className="font-medium text-slate-800">{data.packageName}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <i className="fa-solid fa-star text-yellow-500"></i>
                    </div>
                </motion.div>

                <motion.div
                    className="flex justify-between items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full h-8 w-8 flex items-center justify-center">
                            <i className="fa-solid fa-calendar text-indigo-600"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Date</p>
                            <p className="font-medium text-slate-800">{formatDate(data.bookingDate)}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="flex justify-between items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full h-8 w-8 flex items-center justify-center">
                            <i className="fa-solid fa-clock text-indigo-600"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Time</p>
                            <p className="font-medium text-slate-800">{timeConvert(data.startTime)} - {timeConvert(data.endTime)}</p>
                            <p className="font-medium text-slate-800">duration: {data.duration} hour </p>
                        </div>
                    </div>
                    <div>
                        <span className="font-medium text-indigo-600">{formatPrice(data.price)}</span>
                    </div>
                </motion.div>


            </div>
        </div>
    )
}