export default function SelectInput({
    label,
    value,
    onChange,
    options,
    placeholder = "Select an option...",
    iconClass = "fas fa-chevron-down",
}) {
    return (
        <div className="mb-6">
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                >
                    <option value="" disabled hidden className="text-gray-400">
                        {placeholder}
                    </option>
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {iconClass && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <i className={iconClass}></i>
                    </div>
                )}
            </div>
        </div>
    );
}
