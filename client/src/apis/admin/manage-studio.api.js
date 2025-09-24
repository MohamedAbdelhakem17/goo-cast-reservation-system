import axiosInstance from "@/utils/axios-instance";
import { useMutation } from "@tanstack/react-query";

function buildStudioFormData(payload, options = {}) {
  const formData = new FormData();

  const {
    imageFields = ["thumbnail"],
    galleryField = "imagesGallery",
    existingGalleryField = "existingImages",
  } = options;

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // Handle Gallery
    if (key === galleryField && Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(galleryField, item);
        } else if (typeof item === "string") {
          const imageName = item.split("/").pop();
          formData.append(`${existingGalleryField}[]`, imageName);
        }
      });
      return;
    }

    // Handle Image Fields (e.g. thumbnail)
    if (imageFields.includes(key)) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "string") {
        const imageName = value.split("/").pop();
        formData.append(`${key}Url`, imageName);
      }
      return;
    }

    // Arrays (e.g. equipment[], facilities[])
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
      return;
    }

    // Nested Objects
    if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        formData.append(`${key}[${subKey}]`, subValue);
      });
      return;
    }

    // Default: normal fields
    formData.append(key, value);
  });

  return formData;
}

const handelAddStudio = async (payload) => {
  const formData = buildStudioFormData(payload, {
    imageFields: ["thumbnail"],
    galleryField: "imagesGallery",
  });

  const { data } = await axiosInstance.post(`/studio`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const useAddStudio = () => {
  const {
    mutate: addStudio,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["add-studio"],
    mutationFn: handelAddStudio,
  });

  return { addStudio, isPending, error };
};

export const useDeleteStudio = () => {
  const {
    mutate: deleteStudio,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["delete-studio"],
    mutationFn: async (studioId) => {
      const { data } = await axiosInstance.delete(`/studio/${studioId}`);

      return data;
    },
  });

  return { deleteStudio, error, isPending };
};

const handelUpdateStudio = async ({ id, payload }) => {
  const formData = buildStudioFormData(payload, {
    imageFields: ["thumbnail"],
    galleryField: "imagesGallery",
    existingGalleryField: "existingImages",
  });

  const { data } = await axiosInstance.put(`/studio/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const useUpdateStudio = () => {
  const {
    mutate: updateStudio,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["update-studio"],

    mutationFn: handelUpdateStudio,
  });

  return { isPending, error, updateStudio };
};
