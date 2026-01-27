import { axiosInstanceV2 } from "@/utils/axios-instance";
import { useMutation, useQuery } from "@tanstack/react-query";

const useGetActivePromotions = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["active-promotions"],
    queryFn: async () => {
      const { data } = await axiosInstanceV2("promotions/active");

      return data;
    },
  });

  return { data, error, isLoading };
};

const useGetAllPromotions = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["all-promotions"],

    queryFn: async () => {
      const { data } = await axiosInstanceV2("promotions/");
      return data;
    },
  });

  return { data, error, isLoading };
};

const useAddPromotion = () => {
  const { mutate, isPending, error } = useMutation({
    mutationKey: ["add-promotion"],

    mutationFn: async (newPromotion) => {
      const { data } = await axiosInstanceV2.post("promotions/", newPromotion);

      return data;
    },
  });
  return { mutate, isPending, error };
};

const useEditPromotion = () => {
  const { mutate, isPending, error } = useMutation({
    mutationKey: ["edit-promotion"],

    mutationFn: async ({ values, id }) => {
      const { data } = await axiosInstanceV2.put(`promotions/${id}`, values);

      return data;
    },
  });
  return { mutate, isPending, error };
};

const useDeletePromotion = () => {
  const { mutate, isPending, error } = useMutation({
    mutationKey: ["delete-promotion"],
    mutationFn: async (id) => {
      const { data } = await axiosInstanceV2.delete(`promotions/${id}`);
      return data;
    },
  });
  return { mutate, isPending, error };
};

export {
  useAddPromotion,
  useDeletePromotion,
  useEditPromotion,
  useGetActivePromotions,
  useGetAllPromotions,
};
