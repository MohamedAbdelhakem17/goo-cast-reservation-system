import { axiosInstanceV2 } from "@/utils/axios-instance";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch all active promotions
 * @returns {Object} Query result object
 * @returns {Object} data - The response data containing active promotions
 * @returns {Error} error - Error object if the request fails
 * @returns {boolean} isLoading - Loading state of the query
 */
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

/**
 * Custom hook to fetch all promotions (active and inactive)
 * @returns {Object} Query result object
 * @returns {Object} data - The response data containing all promotions
 * @returns {Error} error - Error object if the request fails
 * @returns {boolean} isLoading - Loading state of the query
 */
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

/**
 * Custom hook to add a new promotion
 * @returns {Object} Mutation result object
 * @returns {Function} mutate - Function to trigger the mutation with newPromotion data
 * @returns {boolean} isPending - Loading state of the mutation
 * @returns {Error} error - Error object if the mutation fails
 */
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

/**
 * Custom hook to edit an existing promotion
 * @returns {Object} Mutation result object
 * @returns {Function} mutate - Function to trigger the mutation with {values, id} object
 * @returns {boolean} isPending - Loading state of the mutation
 * @returns {Error} error - Error object if the mutation fails
 */
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

/**
 * Custom hook to delete a promotion
 * @returns {Object} Mutation result object
 * @returns {Function} mutate - Function to trigger the mutation with promotion id
 * @returns {boolean} isPending - Loading state of the mutation
 * @returns {Error} error - Error object if the mutation fails
 */
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
