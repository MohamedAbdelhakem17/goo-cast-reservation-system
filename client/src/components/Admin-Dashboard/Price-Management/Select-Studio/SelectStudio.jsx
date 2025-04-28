import useGetAllStudios from '../../../../apis/studios/studios.api'

export default function SelectStudio({ selectedStudio, setSelectedStudio}) {
    const { data: studiosData } = useGetAllStudios()
    return (
        <div className="mb-10">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Studio
            </label>
            <select
                value={selectedStudio}
                onChange={(e) => setSelectedStudio(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 transition-shadow"
            >
                <option value="">Select a studio...</option>
                {studiosData?.data?.map((studio) => (
                    <option key={studio._id} value={studio._id}>
                        {studio.name}
                    </option>
                ))}
            </select>
        </div>
    )
}
