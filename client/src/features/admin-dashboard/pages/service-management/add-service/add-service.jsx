import { motion, AnimatePresence } from "framer-motion";
import FormStepper from "@/features/admin-dashboard/_components/form-steeper";
import FormNavigationButtons from "@/features/admin-dashboard/_components/form-navigation-buttons";
import { useState } from "react";
import { useFormik } from "formik";
import {
  packageValidationSchema,
  getInitialPackageValues,
} from "@/utils/schemas/package.schema";
import { hasError } from "@/utils/formik-helper";
import EnglishPackageFields from "./_components/english-package-fields";
import ArabicPackageFields from "./_components/arabic-package-fields";
import ShardPackageFields from "./_components/shard-package-fields";
import useLocalization from "@/context/localization-provider/localization-context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetSinglePackage } from "@/apis/admin/manage-package.api";
import { useAddNewPackage, useUpdatePackage } from "@/apis/admin/manage-package.api";
import { Loading } from "@/components/common";
import { EmptyState } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";

const STEP_FIELDS = {
  0: [
    // Step 0: English-only fields
    "name.en",
    "target_audience.en",
    "description.en",
    "details.en",
    "post_session_benefits.en",
    // "session_type.en",
  ],
  1: [
    // Step 1: Arabic-only fields
    "name.ar",
    "target_audience.ar",
    "description.ar",
    "details.ar",
    "post_session_benefits.ar",
    // "session_type.ar",
  ],
  2: [
    // Step 2: Common (non-language specific) fields
    "price",
    "image",
    "category",
  ],
};

// Container fade animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0 },
};

// Child items fade
const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
  exit: { opacity: 0, y: -5, transition: { duration: 0.15 } },
};

export default function AddService() {
  // Localization
  const { t } = useLocalization();

  // Navigation
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(searchParams.get("edit"));

  // Stet
  const [currentStep, setCurrentStep] = useState(0);

  // Query
  const { data: editedPackage, isLoading } = useGetSinglePackage(
    searchParams.get("edit"),
  );

  // Mutation
  const { createPackage, isPending: isCreating } = useAddNewPackage();
  const { updatePackage, isPending: isUpdating } = useUpdatePackage();

  // Hooks
  const { addToast } = useToast();

  // Function
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

  const handelAddPackage = (payload) => {
    console.log(payload);
    createPackage(payload, {
      onSuccess: (response) => {
        addToast(response.message || t("package-created-successfully"), "success");
        setTimeout(() => {
          navigate("/admin-dashboard/service");
        }, 2000);
      },
      onError: (error) => {
        console.log(error);
        addToast(error.response?.data?.message || t("something-went-wrong"), "error");
      },
    });
  };

  const handelEditPackage = ({ id, payload }) => {
    updatePackage(
      { id, payload },
      {
        onSuccess: (response) => {
          addToast(response.message || t("package-updated-successfully"), "success");

          setTimeout(() => {
            navigate("/admin-dashboard/service");
          }, 2000);
        },

        onError: (error) => {
          addToast(error.response?.data?.message || t("something-went-wrong"), "error");
        },
      },
    );
  };

  // Form  and  validation
  const formik = useFormik({
    initialValues: getInitialPackageValues(editedPackage?.data),
    // validationSchema: packageValidationSchema,
    onSubmit: (values) => {
      if (isEdit) {
        //  edit case
        handelEditPackage({ id: editedPackage?.data?._id, payload: values });
      } else {
        // add case
        handelAddPackage(values);
      }
    },
    enableReinitialize: true,
  });

  // variables
  const FORM_STEPS = [t("add-english"), t("add-arabic"), t("shared")];
  const isHasError = hasError(STEP_FIELDS, currentStep, formik);

  const activeStep = {
    0: <EnglishPackageFields formik={formik} />,
    1: <ArabicPackageFields formik={formik} />,
    2: <ShardPackageFields formik={formik} />,
  };

  if (isLoading) return <Loading />;

  if (isEdit && editedPackage === undefined) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ms:p-8 container mx-auto scale-[.95]"
    >
      {/* Header title */}
      <h2 className="border-main mb-4 rounded-md border-b py-2 text-center text-3xl font-bold text-gray-800">
        {isEdit ? t("edit-service") : t("add-new-service")}
      </h2>

      {/* Form step */}
      <FormStepper steps={FORM_STEPS} currentStep={currentStep} />

      {/* Form */}
      <form
        onSubmit={formik.handleSubmit}
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
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={itemVariants} className="rounded-lg">
                {/* Current Fields */}
                {activeStep[currentStep]}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <FormNavigationButtons
          currentStep={currentStep}
          TOTAL_STEPS={FORM_STEPS.length}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          isLoading={isCreating || isUpdating}
          hasError={isHasError}
          finalStepText={isEdit ? t("edit-package") : t("add-package")}
        />
      </form>
    </motion.div>
  );
}
