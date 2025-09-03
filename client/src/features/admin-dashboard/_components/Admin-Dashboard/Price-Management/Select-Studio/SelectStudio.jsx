import useGetAllStudios from '@/apis/studios/studios.api'
import {SelectInput} from '@/components/common'

export default function SelectStudio({ selectedStudio, setSelectedStudio }) {
    const { data: studiosData } = useGetAllStudios()

    return (
        <div className="mb-10">
            <SelectInput
                label={"🎙️ Choose a Studio"}
                placeholder=" Select a Studio..."
                value={selectedStudio}
                onChange={(e) => setSelectedStudio(e.target.value)}
                options={studiosData?.data?.map((studio) => ({ value: studio._id, label: studio.name }))}
            />
        </div>
    )
}
