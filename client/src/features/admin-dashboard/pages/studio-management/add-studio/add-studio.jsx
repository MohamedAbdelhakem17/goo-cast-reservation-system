/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useFormik } from "formik";
import { Input, TextArea } from "@/components/common";
import { motion } from "framer-motion";
// import AddNewStudio from "@/apis/studios/add.studio.api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { ErrorFeedback } from "@/components/common";
import { getStudioInitialValues, validationSchema } from "@/utils/schemas/studio.schema";
import ImagesInputs from "./_components/images-inputs";
import EquipmentInput from "./_components/equipment-input";
import FacilitiesInput from "./_components/facilities-input";
import { useUpdateStudio } from "@/apis/admin/manage-studio.api";
import { useGetOneStudio } from "@/apis/public/studio.api";
import useLocalization from "@/context/localization-provider/localization-context";
import { useState } from "react";
import { hasError } from "@/utils/formik-helper";
import FormNavigationButtons from "./../../../_components/form-navigation-buttons";
import StudioEnglishFields from "./_components/studio-english-fields";
import StudioArabicFields from "./_components/studio-arabic-fields";
import StudioShardFields from "./studio-shard-fields";
import FormStepper from "@/features/admin-dashboard/_components/form-steeper";
import { AnimatePresence } from "framer-motion";

const STEP_FIELDS = {
  0: [
    // Step 0: English-only fields
    "name.en",
    "address.en",
    "description.en",
    "facilities.en",
    "equipment.en",
  ],
  1: [
    // Step 1: Arabic-only fields
    "name.ar",
    "address.ar",
    "description.ar",
    "facilities",
    "equipment",
  ],
  2: [
    // Step 2: Common fields (no language)
    "basePricePerSlot",
    "isFixedHourly",
    "startTime",
    "endTime",
    "thumbnail",
    "imagesGallery",
    "dayOff",
    "minSlotsPerDay",
  ],
};

export default function AddStudio() {
  const { t } = useLocalization();
  const FORM_STEPS = [t("add-english"), t("add-arabic"), t("shared")];
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const navigate = useNavigate();
  const { addToast } = useToast();

  // const { formik, isPending } = AddNewStudio({
  //   onSuccess: (response) => {
  //     addToast(response.message || "Studio added successfully", "success");
  //     setTimeout(() => {
  //       navigate("/admin-dashboard/studio");
  //     }, 2000);
  //   },
  //   onError: (error) => {
  //     addToast(error.response?.data?.message || "Something went wrong", "error");
  //   },
  // });
  const [searchParams] = useSearchParams();
  const { data: updatedStudio } = useGetOneStudio(searchParams.get("edit"));
  const { updateStudio, isLoading: isUpdating } = useUpdateStudio();
  const isEdit = Boolean(searchParams.get("edit"));

  // Formik setup
  const form = useFormik({
    initialValues: getStudioInitialValues(updatedStudio?.data),
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const finalData = {
        ...values,
      };

      if (isEdit) {
        updateStudio(
          { id: updatedStudio.data._id, data: finalData },
          {
            onSuccess: (response) => {
              addToast(response.message || "Studio updated successfully", "success");
              setTimeout(() => {
                navigate("/admin-dashboard/studio-management");
              }, 2000);
            },
            onError: (error) => {
              addToast(error.response?.data?.message || "Something went wrong", "error");
            },
          },
        );
      } else {
        formik.setValues(finalData);
        setTimeout(() => {
          formik.handleSubmit();
        }, 100);
      }
    },
  });

  const isPending = true;
  const currentLoading = isEdit ? isUpdating : isPending;

  const isHasError = hasError(STEP_FIELDS, currentStep, form);

  // const isHasError = false;
  const activeStep = {
    0: <StudioEnglishFields formik={form} />,
    1: <StudioArabicFields formik={form} />,
    2: <StudioShardFields formik={form} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ms:p-8 container mx-auto py-6"
    >
      <div className="md:p-8">
        <h2 className="border-main mb-8 rounded-md border-b pb-4 text-center text-3xl font-bold text-gray-800">
          {isEdit ? t("edit-studio") : t("add-new-studio")}
        </h2>

        {/* Form step */}
        <FormStepper steps={FORM_STEPS} currentStep={currentStep} />

        {/* Form */}
        <form
          onSubmit={form.handleSubmit}
          className="my-4 rounded-md bg-white px-4 py-10 shadow"
        >
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Render fields dynamically based on step */}
              {activeStep[currentStep]}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <FormNavigationButtons
            currentStep={currentStep}
            TOTAL_STEPS={FORM_STEPS.length}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            hasError={isHasError}
            finalStepText={isEdit ? "Edit Studio" : "Add Studio"}
          />
        </form>
      </div>
    </motion.div>
  );
}
