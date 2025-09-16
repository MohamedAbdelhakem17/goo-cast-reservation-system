import { motion, AnimatePresence } from "framer-motion";

export default function CategoryList({ categories, onEdit, onDelete }) {
  if (categories?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-8 text-center text-gray-500"
      >
        No categories found. Add your first category!
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
            >
              Name English
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
            >
              Min. Hours
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <AnimatePresence>
            {categories.map((category) => (
              <motion.tr
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  {category.name?.en}
                </td>

                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {category.minHours} hours
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="rounded-full p-1 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-900"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className="rounded-full p-1 text-red-600 transition-colors hover:bg-red-100 hover:text-red-900"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
