import { motion } from "framer-motion";
import FormStepper from "@/features/admin-dashboard/_components/form-steeper";
import FormNavigationButtons from "@/features/admin-dashboard/_components/form-navigation-buttons";
import { useState } from "react";
import { useFormik } from "formik";
import {
  getPackageValidationSchema,
  initialPackageValues,
} from "@/utils/schemas/package.schema";
import { hasError } from "@/utils/formik-helper";
import EnglishFields from "./_components/english-fields";
import ArabicFields from "./_components/arabic-fields";
import ShardFields from "./_components/shard-fields";

const STEP_FIELDS = {
  0: [
    // Step 0: English-only fields
    "name.en",
    "target_audience.en",
    "description.en",
    "category.en",
    "details.en",
    "post_session_benefits.en",
    "session_type.en",
  ],
  1: [
    // Step 1: Arabic-only fields
    "name.ar",
    "target_audience.ar",
    "description.ar",
    "category.ar",
    "details.ar",
    "post_session_benefits.ar",
    "session_type.ar",
  ],
  2: [
    // Step 2: Common (non-language specific) fields
    "price",
    "image",
    "icon",
    "is_active",
  ],
};

const FORM_STEPS = ["Add English", "Add Arabic", "Shared"];
export default function AddService() {
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

  const isEdit = false;

  const formik = useFormik({
    initialValues: initialPackageValues,
    validationSchema: getPackageValidationSchema(isEdit),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  // const isHasError = hasError(STEP_FIELDS, currentStep, formik);
  const isHasError = false;
  const activeStep = {
    0: <EnglishFields formik={formik} />,
    1: <ArabicFields formik={formik} />,
    2: <ShardFields formik={formik} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ms:p-8 container mx-auto scale-[.95]"
    >
      {/* Header title */}
      <h2 className="border-main mb-4 rounded-md border-b py-2 text-center text-3xl font-bold text-gray-800">
        {isEdit ? "Edit Service" : "Add New Service"}
      </h2>

      {/* Form step */}
      <FormStepper steps={FORM_STEPS} currentStep={currentStep} />

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        {/* Current Fields */}
        {activeStep[currentStep]}
      </form>

      {/* Navigation buttons */}
      <FormNavigationButtons
        currentStep={currentStep}
        TOTAL_STEPS={FORM_STEPS.length}
        handleNextStep={handleNextStep}
        handlePrevStep={handlePrevStep}
        hasError={isHasError}
        finalStepText={isEdit ? "Edit Package" : "Add Package"}
      />
    </motion.div>
  );
}
