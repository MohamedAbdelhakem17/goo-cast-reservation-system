import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import { motion } from "framer-motion";

export default function Chart({ chartData }) {
    return (

        <motion.div
            className="bg-white backdrop-blur-sm bg-opacity-90 p-8 rounded-3xl shadow-xl mb-12 hover:shadow-2xl transition-shadow duration-300"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center capitalize">Visits per Page</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ed1e26" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ed1e26" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#ed1e26" />
                    <YAxis stroke="#ed1e26" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 8px 16px rgba(237, 30, 38, 0.1)'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="visits"
                        stroke="url(#colorVisits)"
                        strokeWidth={3}
                        dot={{ fill: "#ed1e26", strokeWidth: 2 }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    )
}
