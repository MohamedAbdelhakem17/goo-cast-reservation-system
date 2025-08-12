
export default function ServiceType({ selected, setSelected }) {

    const CATEGORY_TYPES = ["Hourly Recording", "Add-Ons"];

    return (
        <div className="flex p-2 rounded-xl shadow-sm gap-2">
            {CATEGORY_TYPES.map((category) => (
                <button
                    key={category}
                    onClick={() => setSelected(category)}
                    className={`w-1/2 py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer
                        ${selected === category
                            ? "bg-main text-white hover:bg-main/80"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"}
                    `}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
