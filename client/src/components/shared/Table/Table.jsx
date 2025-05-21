import { motion } from "framer-motion"

export default function Table({ children, headers }) {
    return <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">

                {/* Table headers */}
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Table rows */}
                <tbody className="bg-white divide-y divide-gray-200">
                    {
                        <motion.tr
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="hover:bg-gray-50 [&_td]:px-6 [&_td]:py-4 [&_td]:whitespace-nowrap"
                        >
                            {children}
                        </motion.tr>
                    }
                </tbody>
            </table>
        </div>

    </div>
}
