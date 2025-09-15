import { Link, useSearchParams } from "react-router-dom";
import { Edit2, PlusCircle } from "lucide-react";
import {
  SelectInput,
  Loading,
  ErrorFeedback,
  OptimizedImage,
  RadioButton,
} from "@/components/common";
import { useEffect, useState } from "react";
import { useGetData } from "@/apis/admin/mange-addons.api";
import usePriceFormat from "@/hooks/usePriceFormat";
import { useChangeAddonsStatus } from "@/apis/admin/mange-addons.api";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";

export default function AddonsManagement() {
  // hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const priceFormat = usePriceFormat();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const initialStatus = searchParams.get("status") || "all";

  // state
  const [status, setStatus] = useState(initialStatus);

  // query
  const { addons, isLoading, error } = useGetData(status);

  // mutation
  const { changeStatus, isPending } = useChangeAddonsStatus();

  // Functions
  const handleStatusChange = async (e) => {
    const selectedValue = e.target.value;
    setStatus(selectedValue);
    setSearchParams({ status: selectedValue });
  };

  const handelUpdateStatus = (value, id) => {
    return new Promise((resolve, reject) => {
      changeStatus(
        { payload: value, id },
        {
          onSuccess: () => {
            addToast("Change status successfully", "success");
            queryClient.invalidateQueries("addons");
            resolve();
          },
          onError: (error) => {
            const errorMessage =
              error?.response?.data?.message || "Failed to change status";

            addToast(errorMessage, "error");

            reject(error);
          },
        },
      );
    });
  };

  // Variables
  const ADDONS_STATUS = [
    { label: "All", value: "all" },
    { label: "Active", value: "true" },
    { label: "In active", value: "false" },
  ];

  // Effects
  useEffect(() => {
    const urlStatus = searchParams.get("status") || "all";
    if (urlStatus !== status) {
      setStatus(urlStatus);
    }
  }, [searchParams]);

  // Loading state
  if (isLoading) return <Loading />;

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center py-5">
        <ErrorFeedback>{error.message}</ErrorFeedback>
      </div>
    );
  }

  return (
    <div className="py-6 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-lg font-bold text-gray-800 md:text-2xl">
          Add-ons Management
        </h1>

        {/* Filter and add new addons */}
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
          <Link
            to="/admin-dashboard/addons/add"
            className="bg-main/80 hover:bg-main mb-6 rounded-lg px-4 py-3 text-white transition-colors"
          >
            <PlusCircle className="mr-2 inline-block" />
            Add New Addons
          </Link>

          <SelectInput
            value={status}
            options={ADDONS_STATUS}
            onChange={handleStatusChange}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg p-2.5">
        {/* <Addons status={status} /> */}
        {addons?.data?.length === 0 ? (
          <p className="py-4 text-center text-gray-500">No addons found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {addons.data.map((addon) => (
              <div
                key={addon._id}
                className="flex flex-col justify-between overflow-hidden rounded-md bg-white shadow"
              >
                {/* Image */}
                <div className="h-80 w-full">
                  <OptimizedImage
                    src={addon.image}
                    alt={addon.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between space-y-6 p-4 pt-6 pb-3">
                  <div className="space-y-4">
                    {/* title */}
                    <h2 className="text-xl font-semibold">{addon.name}</h2>

                    {/* description */}
                    <p className="text-sm font-light text-gray-500">
                      {addon.description}
                    </p>

                    {/* Price and Status */}
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">{priceFormat(addon.price)}</p>
                      <p
                        className={`${
                          addon.is_active
                            ? "bg-main text-white"
                            : "bg-gray-200 text-gray-500"
                        } w-fit rounded-4xl px-2 py-1 text-sm font-bold`}
                      >
                        {addon.is_active ? "Available" : "Not available"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center justify-center gap-2 pt-4">
                    <Link
                      to={`/admin-dashboard/addons/edit/${addon._id}`}
                      className="bg-main flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-white"
                    >
                      <Edit2 />
                      <span>Edit</span>
                    </Link>

                    <RadioButton
                      initialValue={addon.is_active}
                      isPending={isPending}
                      callback={(value) => handelUpdateStatus(value, addon._id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
