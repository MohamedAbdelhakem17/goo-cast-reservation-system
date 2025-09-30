import { SelectInput } from "@/components/common";
import { useGetStudio } from "@/apis/public/studio.api";

export default function SelectStudio({ selectedStudio, setSelectedStudio }) {
  const { data: studiosData } = useGetStudio();

  return (
    <div className="mb-10">
      <SelectInput
        label={"🎙️ Choose a Studio"}
        placeholder=" Select a Studio..."
        value={selectedStudio}
        onChange={(e) => setSelectedStudio(e.target.value)}
        options={studiosData?.data?.map((studio) => ({
          value: studio._id,
          label: studio.name,
        }))}
      />
    </div>
  );
}
