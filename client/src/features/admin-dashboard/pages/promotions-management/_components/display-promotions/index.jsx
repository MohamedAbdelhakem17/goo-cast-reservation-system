import { useGetAllPromotions } from "@/apis/admin/manage-promotions.api";
import { Table } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import PromotionCard from "./promotion-card";
import PromotionRow from "./promotion-row";
import StateDisplay from "./state-display";

const DisplayPromotions = ({ onEdit, onDelete }) => {
  const { t, lng } = useLocalization();
  const { data, isLoading, error } = useGetAllPromotions();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const promotions = data?.data || [];

  if (isLoading) return <StateDisplay type="loading" />;
  if (error || data?.status !== "success")
    return (
      <StateDisplay
        type="error"
        message={t("failed-to-load-promotions-please-try-again")}
      />
    );
  if (!promotions.length)
    return <StateDisplay type="empty" message={t("no-promotions-found")} />;

  if (isMobile)
    return (
      <div className="space-y-4 p-2">
        {promotions.map((promotion) => (
          <PromotionCard
            key={promotion._id}
            promotion={promotion}
            lng={lng}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Table
        headers={[
          "Title",
          "Description",
          "Start Date",
          "End Date",
          "Status",
          "Priority",
          "Active",
          "Actions",
        ]}
      >
        {promotions.map((promotion) => (
          <PromotionRow
            key={promotion._id}
            promotion={promotion}
            lng={lng}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Table>
    </div>
  );
};

export default DisplayPromotions;
