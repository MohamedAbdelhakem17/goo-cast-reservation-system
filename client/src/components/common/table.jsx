export default function Table({ children, headers }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table headers */}
          <thead className="bg-gray-50">
            <tr>
              {headers?.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table rows */}
          <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
