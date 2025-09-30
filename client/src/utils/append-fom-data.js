export function appendDataToFormData(
  data,
  imageFieldKey = "image",
  imageFormDataKey = "image",
) {
  const formData = new FormData();

  const appendFormData = (formData, data, parentKey = "") => {
    if (data instanceof File) {
      formData.append(parentKey, data);
    } else if (typeof data === "object" && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        const newKey = parentKey ? `${parentKey}[${key}]` : key;
        appendFormData(formData, value, newKey);
      });
    } else if (data !== undefined && data !== null) {
      formData.append(parentKey, data);
    }
  };

  Object.entries(data).forEach(([key, value]) => {
    if (key === imageFieldKey) {
      handleImageField(formData, value, imageFormDataKey);
    } else {
      appendFormData(formData, value, key);
    }
  });

  return formData;
}

function handleImageField(formData, value, formKey) {
  if (value instanceof File) {
    formData.append(formKey, value);
  } else if (typeof value === "string") {
    const imageName = value.split("/").pop();
    formData.append(`${formKey}Url`, imageName);
  }
}
