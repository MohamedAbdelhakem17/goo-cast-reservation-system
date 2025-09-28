import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { getStudioInitialValues, validationSchema } from "@/utils/schemas/studio.schema";

import useLocalization from "@/context/localization-provider/localization-context";
import { useState } from "react";
import { hasError } from "@/utils/formik-helper";
import FormNavigationButtons from "./../../../_components/form-navigation-buttons";
import StudioEnglishFields from "./_components/studio-english-fields";
import StudioArabicFields from "./_components/studio-arabic-fields";
import StudioShardFields from "./studio-shard-fields";
import FormStepper from "@/features/admin-dashboard/_components/form-steeper";
import { AnimatePresence } from "framer-motion";
import { useUpdateStudio, useAddStudio } from "@/apis/admin/manage-studio.api";
import { useGetOneStudio } from "@/apis/public/studio.api";
import { EmptyState, Loading } from "@/components/common";

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
    "facilities.ar",
    "equipment.ar",
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
  // Localization
  const { t } = useLocalization();

  // Navigation
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(searchParams.get("edit"));

  // State
  const [currentStep, setCurrentStep] = useState(0);

  // Query
  const { data: updatedStudio, isLoading } = useGetOneStudio(searchParams.get("edit"));

  // Mutation
  const { addStudio, isPending: isAdding } = useAddStudio();
  const { updateStudio, isPending: isUpdating } = useUpdateStudio();
  // Hooks
  const { addToast } = useToast();

  // Functions
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

  const handelAddStudio = (payload) => {
    addStudio(payload, {
      onSuccess: (response) => {
        addToast(response.message || t("studio-added-successfully"), "success");
        setTimeout(() => {
          navigate("/admin-dashboard/studio");
        }, 2000);
      },
      onError: (error) => {
        addToast(error.response?.data?.message || t("something-went-wrong"), "error");
      },
    });
  };

  const handelEditStudio = ({ id, payload }) => {
    updateStudio(
      { id, payload },
      {
        onSuccess: (response) => {
          addToast(response.message || t("studio-updated-successfully"), "success");

          setTimeout(() => {
            navigate("/admin-dashboard/studio");
          }, 2000);
        },

        onError: (error) => {
          addToast(error.response?.data?.message || t("something-went-wrong"), "error");
        },
      },
    );
  };

  // Form and validation
  const form = useFormik({
    initialValues: getStudioInitialValues(updatedStudio?.data),
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const finalData = {
        ...values,
      };

      console.log(finalData);

      if (isEdit) {
        // edit case
        handelEditStudio({ id: updatedStudio.data._id, payload: finalData });
      } else {
        // add case
        handelAddStudio(finalData);
      }
    },

    enableReinitialize: true,
  });

  // Variables
  const isHasError = hasError(STEP_FIELDS, currentStep, form);

  const FORM_STEPS = [t("add-english"), t("add-arabic"), t("shared")];

  const activeStep = {
    0: <StudioEnglishFields formik={form} />,
    1: <StudioArabicFields formik={form} />,
    2: <StudioShardFields formik={form} />,
  };

  if (isLoading) return <Loading />;

  if (isEdit && updatedStudio === undefined) {
    return <EmptyState />;
  }

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
            isLoading={isUpdating || isAdding}
            finalStepText={isEdit ? t("edit-studio") : t("add-studio")}
          />
        </form>
      </div>
    </motion.div>
  );
}
