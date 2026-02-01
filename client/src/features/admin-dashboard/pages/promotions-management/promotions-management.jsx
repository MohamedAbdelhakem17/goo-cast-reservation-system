import { Button, Popup } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import AddPromotionsForm from "./_components/add-promotions-form";
import DeletePromotion from "./_components/delete-promotion";
import DisplayPromotions from "./_components/display-promotions";

export default function PromotionsManagement() {
  //  Translation
  const { t } = useLocalization();

  // State
  const [isAddPromotionOpen, setIsAddPromotionOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [initialFormData, setInitialFormData] = useState(null);
  const [deletePromotion, setDeletePromotion] = useState(null);

  return (
    <div className="py-6 md:p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b-1 border-gray-200 pb-4">
        {/* Title */}
        <h1 className="text-lg font-bold text-gray-800 md:text-2xl">
          {t("promotions-management")}
        </h1>

        {/* Add New Promotion */}
        <Button
          className="!mt-0"
          onClick={() => {
            setFormMode("add");
            setInitialFormData(null);
            setIsAddPromotionOpen(true);
          }}
          type="button"
        >
          {/* Icon */}
          <PlusCircle className="me-2 inline-block" />

          {/* Label */}
          {t("add-new-promotion")}
        </Button>
      </div>

      {/* Display Promotions */}
      <DisplayPromotions
        onEdit={(promotion) => {
          setFormMode("edit");
          setInitialFormData(promotion);
          setIsAddPromotionOpen(true);
        }}
        onDelete={(promotion) => setDeletePromotion(promotion)}
      />

      {/* Add Promotion Popup */}
      {isAddPromotionOpen && (
        <Popup>
          <AddPromotionsForm
            onClose={() => setIsAddPromotionOpen(false)}
            mode={formMode}
            initialData={initialFormData}
          />
        </Popup>
      )}

      {/* Delete Promotion Popup */}
      {deletePromotion && (
        <Popup>
          <DeletePromotion
            onClose={() => setDeletePromotion(null)}
            promotion={deletePromotion}
          />
        </Popup>
      )}
    </div>
  );
}
