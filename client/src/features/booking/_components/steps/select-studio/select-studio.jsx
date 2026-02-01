import { useCallback, useState } from "react";

import { useGetAvailableStudios } from "@/apis/public/booking.api";
import { useGetStudio } from "@/apis/public/studio.api";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { tracking } from "@/utils/gtm";

import BookingLabel from "../../booking-label";
import ImagePreviewModal from "./_components/image-preview-modal";
import InlineStudioCard from "./_components/inline-studio-card";
import StudioCard from "./_components/studio-card";

export default function SelectStudio() {
  const { t, lng } = useLocalization();
  const { bookingData, setBookingField, handleNextStep } = useBooking();
  const { addToast } = useToast();

  const [selectedStudio, setSelectedStudio] = useState(bookingData?.studio?.id || null);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [liveViewMode, setLiveViewMode] = useState({});

  // Use available studios API if we have booking details, otherwise use all studios
  const shouldUseAvailableStudios =
    bookingData.date && bookingData.startSlot && bookingData.duration;

  const {
    data: availableStudiosData,
    isLoading: isLoadingAvailable,
    error: errorAvailable,
  } = useGetAvailableStudios(
    {
      date: bookingData.date,
      startSlot: bookingData.startSlot,
      duration: bookingData.duration,
    },
    { enabled: shouldUseAvailableStudios },
  );

  const {
    data: allStudiosData,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useGetStudio(true, { enabled: !shouldUseAvailableStudios });

  const studiosData = shouldUseAvailableStudios ? availableStudiosData : allStudiosData;
  const isLoading = shouldUseAvailableStudios ? isLoadingAvailable : isLoadingAll;
  const error = shouldUseAvailableStudios ? errorAvailable : errorAll;

  // -----------------------------
  // Image Carousel Handlers
  // Studio Selection Handlers (Memoized)
  // -----------------------------
  const selectStudio = useCallback(
    (studio) => {
      setBookingField("studio", {
        id: studio._id,
        name: studio.name,
        image: studio.thumbnail,
        recording_seats: studio.recording_seats,
      });

      // Keep original functionality
      setBookingField("startSlot", null);
      setBookingField("duration", 1);
      setBookingField("endSlot", null);

      tracking("add-studio", { studio_name: studio.name?.[lng] });
      setSelectedStudio(studio._id);
    },
    [setBookingField, lng],
  );

  const selectStudioAndNext = useCallback(
    (studio) => {
      setBookingField("studio", {
        id: studio._id,
        name: studio.name,
        image: studio.thumbnail,
        recording_seats: studio.recording_seats,
      });

      setBookingField("startSlot", null);
      setBookingField("duration", 1);
      setBookingField("endSlot", null);

      tracking("add-studio", { studio_name: studio.name?.[lng] });
      setSelectedStudio(studio._id);

      addToast(t("studio-selected-successfully"), "success", 1000);
      handleNextStep();
    },
    [setBookingField, lng, addToast, t, handleNextStep],
  );

  // Legacy handler for external StudioCard component
  const selectStudioHandler = useCallback(
    (studio, next = false) => {
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
    },
    [setBookingField, lng, handleNextStep, addToast, t],
  );

  // -----------------------------
  // Preview Modal Handlers (Memoized)
  // -----------------------------
  const handlePreview = useCallback((images, currentIndex) => {
    setPreviewImages(images);
    setPreviewIndex(currentIndex);
  }, []);

  const nextImage = useCallback(() => {
    if (previewIndex !== null) {
      setPreviewIndex((prev) => (prev + 1 < previewImages.length ? prev + 1 : 0));
    }
  }, [previewIndex, previewImages.length]);

  const prevImage = useCallback(() => {
    if (previewIndex !== null) {
      setPreviewIndex((prev) => (prev - 1 >= 0 ? prev - 1 : previewImages.length - 1));
    }
  }, [previewIndex, previewImages.length]);

  // -----------------------------
  // Live View Toggle Handler (Memoized)
  // -----------------------------
  const toggleLiveView = useCallback((studioId) => {
    setLiveViewMode((prev) => ({
      ...prev,
      [studioId]: !prev[studioId],
    }));
  }, []);

  // -----------------------------
  // Main Render
  // -----------------------------
  return (
    <div className="space-y-6">
      <BookingLabel
        title={t("choose-your-studio")}
        desc={t("select-the-studio-that-best-fits-your-needs")}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {studiosData?.data.map((studio) =>
          shouldUseAvailableStudios ? (
            <InlineStudioCard
              key={studio._id}
              studio={studio}
              selectedStudio={selectedStudio}
              bookingData={bookingData}
              lng={lng}
              t={t}
              onSelect={selectStudio}
              onSelectAndNext={selectStudioAndNext}
              onPreview={handlePreview}
              liveViewMode={liveViewMode}
              onToggleLiveView={toggleLiveView}
            />
          ) : (
            <StudioCard
              key={studio._id}
              studio={studio}
              isActive={selectedStudio === studio._id}
              onSelect={selectStudioHandler}
              setPreviewImages={setPreviewImages}
              setPreviewIndex={setPreviewIndex}
              handleNextStep={handleNextStep}
            />
          ),
        )}
      </div>

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
