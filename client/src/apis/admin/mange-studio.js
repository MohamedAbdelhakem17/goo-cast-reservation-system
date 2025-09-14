import axiosInstance from "@/utils/axios-instance";
import { useMutation } from "@tanstack/react-query";

const handelAddStudio = async (payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (key === "imagesGallery" && Array.isArray(value)) {
      value.forEach((file) => formData.append("imagesGallery", file));
      return;
    }

    if (key === "thumbnail" && value) {
      formData.append("thumbnail", value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
      return;
    }

    if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        formData.append(`${key}[${subKey}]`, subValue);
      });
      return;
    }

    formData.append(key, value);
  });

  const { data } = await axiosInstance.post(`/studio`, formData);

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
  const formData = new FormData();

  const basicFields = [
    "name",
    "address",
    "basePricePerSlot",
    "isFixedHourly",
    "description",
    "startTime",
    "endTime",
  ];

  basicFields.forEach((key) => {
    if (data[key] !== undefined) {
      formData.append(key, payload[key]);
    }
  });

  // Thumbnail
  if (payload.thumbnail instanceof File) {
    formData.append("thumbnail", payload.thumbnail);
  } else if (typeof payload.thumbnail === "string") {
    const thumbnailName = payload.thumbnail.split("/").pop();
    formData.append("thumbnailUrl", thumbnailName);
  }

  // Images Gallery
  if (Array.isArray(payload.imagesGallery)) {
    payload.imagesGallery.forEach((img) => {
      if (img instanceof File) {
        formData.append("imagesGallery", img);
      } else if (typeof img === "string") {
        const imageName = img.split("/").pop();
        formData.append("existingImages[]", imageName);
      }
    });
  }

  // Facilities
  if (Array.isArray(payload.facilities)) {
    payload.facilities.forEach((facility) => {
      formData.append("facilities[]", facility);
    });
  }

  // Equipment
  if (Array.isArray(payload.equipment)) {
    payload.equipment.forEach((item) => {
      formData.append("equipment[]", item);
    });
  }

  const { data } = await axiosInstance.put(`/studio/${id}`, formData);

  return data;
};

export const UpdateStudio = () => {
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
