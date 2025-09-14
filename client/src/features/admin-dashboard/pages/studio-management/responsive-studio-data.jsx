import { ResponsiveTable } from "@/components/common";
import ActionsButtons from "./actions-buttons";
import usePriceFormat from "@/hooks/usePriceFormat";
import { OptimizedImage } from "@/components/common";

export default function ResponsiveStudioData({ studiosData, setSelectedStudio }) {
  const priceFormat = usePriceFormat();

  return (
    <>
      {studiosData?.data.map((studio) => (
        <ResponsiveTable
          key={studio._id}
          title={studio.name}
          subtitle={
            <OptimizedImage
              src={studio.thumbnail}
              alt={studio.name}
              className="size-24 rounded-lg object-cover"
            />
          }
          fields={[
            {
              label: "Price per hour",
              value: priceFormat(studio.pricePerHour || studio.basePricePerSlot),
            },
          ]}
          actions={
            <ActionsButtons setSelectedStudio={setSelectedStudio} studio={studio} />
          }
        />
      ))}
    </>
  );
}
