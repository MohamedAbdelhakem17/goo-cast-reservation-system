const getFieldValue = (field, formik) => {
  const keys = field?.split(".");
  return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.values);
};

const getFieldError = (field, formik) => {
  const keys = field?.split(".");
  return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.errors);
};

const hasError = (steps, currentStep, formik) => {
  const fields = steps[currentStep] || [];
  return fields.some((field) => {
    const value = getFieldValue(field, formik);
    const error = getFieldError(field, formik);
    return !value || error;
  });
};

export { hasError, getFieldValue, getFieldError };
