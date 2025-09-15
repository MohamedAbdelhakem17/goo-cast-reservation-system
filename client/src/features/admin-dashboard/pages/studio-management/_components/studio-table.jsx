import { Table } from "@/components/common";
import ActionsButtons from "./actions-buttons";
import usePriceFormat from "@/hooks/usePriceFormat";
import { OptimizedImage } from "@/components/common";

export default function StudioTable({ studiosData, setSelectedStudio }) {
  const TABLE_HEADERS = ["Image", "Name", " Price per Hour", "Actions"];
  const priceFormat = usePriceFormat();

  return (
    <>
      <Table headers={TABLE_HEADERS}>
        {studiosData?.data.map((studio) => (
          <tr key={studio._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <OptimizedImage
                src={studio.thumbnail}
                alt={studio.name}
                className="h-10 w-10 rounded-lg object-cover"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{studio.name}</div>
              <div className="text-sm text-gray-500">{studio.address}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {priceFormat(studio.pricePerHour || studio.basePricePerSlot)}
              </div>
            </td>
            <td>
              <ActionsButtons setSelectedStudio={setSelectedStudio} studio={studio} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
