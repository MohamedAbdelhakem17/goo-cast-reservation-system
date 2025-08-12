
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

                    {children}

                </tbody>
            </table>
        </div>

    </div>
}
