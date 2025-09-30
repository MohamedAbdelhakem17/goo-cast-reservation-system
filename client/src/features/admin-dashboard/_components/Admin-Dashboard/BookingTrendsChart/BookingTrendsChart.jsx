import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

export default function BookingTrendsChart({ data }) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            className="bg-white backdrop-blur-sm bg-opacity-90 p-8 rounded-3xl shadow-xl mb-12 hover:shadow-2xl transition-shadow duration-300"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Booking Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <defs>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ed1e26" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ed1e26" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="label"
                        stroke="#666"
                        tickFormatter={formatDate}
                    />
                    <YAxis stroke="#666" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 8px 16px rgba(237, 30, 38, 0.1)'
                        }}
                        labelFormatter={formatDate}
                    />
                    <Bar
                        dataKey="count"
                        fill="url(#colorBookings)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}