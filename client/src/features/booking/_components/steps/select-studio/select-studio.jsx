import { useGetStudio } from "@/apis/public/studio.api";
import { ErrorFeedback, Loading } from "@/components/common";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { tracking } from "@/utils/gtm";
import { useState } from "react";
import BookingLabel from "../../booking-label";
import ImagePreviewModal from "./_components/image-preview-modal";
import StudioCard from "./_components/studio-card";

export default function SelectStudio() {
  const { t, lng } = useLocalization();
  const { setBookingField, bookingData, handleNextStep } = useBooking();
  const { addToast } = useToast();

  const [selectedStudio, setSelectedStudio] = useState(bookingData?.studio?.id || null);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);

  const { data: studiosData, isLoading, error } = useGetStudio(true);

  const selectStudioHandler = (studio, next = false) => {
    setBookingField("studio", studio);
    setBookingField("startSlot", null);
    setBookingField("duration", 1);
    setBookingField("endSlot", null);
    setSelectedStudio(studio.id);
    tracking("add-studio", { studio_name: studio.name?.[lng] });
    if (next) {
      handleNextStep();
      addToast(t("studio-selected-successfully"), "success", 1000);
    }
  };

  const nextImage = () => {
    if (previewIndex !== null) {
      setPreviewIndex((prev) => (prev + 1 < previewImages.length ? prev + 1 : 0));
    }
  };

  const prevImage = () => {
    if (previewIndex !== null) {
      setPreviewIndex((prev) => (prev - 1 >= 0 ? prev - 1 : previewImages.length - 1));
    }
  };

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorFeedback>
        {error.response?.data?.message || error.message || "Something went wrong"}
      </ErrorFeedback>
    );

  return (
    <div className="space-y-6">
      <BookingLabel
        title={t("choose-your-studio")}
        desc={t("select-the-studio-that-best-fits-your-needs")}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {studiosData.data.map((studio) => (
          <StudioCard
            key={studio._id}
            studio={studio}
            isActive={selectedStudio === studio._id}
            onSelect={selectStudioHandler}
            setPreviewImages={setPreviewImages}
            setPreviewIndex={setPreviewIndex}
            handleNextStep={handleNextStep}
          />
        ))}
      </div>

      {/* Preview Modal */}
      <ImagePreviewModal
        previewImages={previewImages}
        previewIndex={previewIndex}
        setPreviewIndex={setPreviewIndex}
        nextImage={nextImage}
        prevImage={prevImage}
      />
    </div>
  );
}
