export function appendDataToFormData(
  data,
  imageFieldKey = "image",
  imageFormDataKey = "image",
) {
  const formData = new FormData();

  const appendFormData = (formData, data, parentKey = "") => {
    if (data instanceof File) {
      formData.append(parentKey, data);
    } else if (Array.isArray(data)) {
      // Handle arrays explicitly
      if (data.length === 0) {
        // Append empty array marker so backend knows to clear the field
        formData.append(parentKey, JSON.stringify([]));
      } else {
        data.forEach((item, index) => {
          const newKey = `${parentKey}[${index}]`;
          appendFormData(formData, item, newKey);
        });
      }
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
    } else if (key === "recommendation_rules" || key === "tags") {
      // Stringify complex objects/arrays for proper backend parsing
      formData.append(key, JSON.stringify(value));
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
