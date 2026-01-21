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
    const error = getFieldError(field, formik);
    const touched = formik.touched[field];

    return touched && error;
  });
};

export { getFieldError, getFieldValue, hasError };
