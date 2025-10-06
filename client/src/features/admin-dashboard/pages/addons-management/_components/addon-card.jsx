import { Edit2, Trash } from "lucide-react";
import usePriceFormat from "@/hooks/usePriceFormat";
import { OptimizedImage, RadioButton } from "@/components/common";
import { useChangeAddonsStatus } from "@/apis/admin/manage-addons.api";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useLocalization from "@/context/localization-provider/localization-context";

export default function AddonCart({ addon, setDeletedAddon }) {
  // Localization
  const { t, lng } = useLocalization();
  // mutation
  const { changeStatus, isPending } = useChangeAddonsStatus();

  // hooks
  const priceFormat = usePriceFormat();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const handelUpdateStatus = (value, id) => {
    return new Promise((resolve, reject) => {
      changeStatus(
        { payload: value, id },
        {
          onSuccess: () => {
            addToast(t("change-status-successfully"), "success");
            queryClient.invalidateQueries("addons");
            resolve();
          },
          onError: (error) => {
            const errorMessage =
              error?.response?.data?.message || t("failed-to-change-status");

            addToast(errorMessage, "error");

            reject(error);
          },
        },
      );
    });
  };

  return (
<<<<<<< HEAD
    <div className="flex flex-col justify-between overflow-hidden rounded-md bg-white shadow">
=======
    <div
      key={addon._id}
      className="flex flex-col justify-between overflow-hidden rounded-md bg-white shadow"
    >
>>>>>>> 2bbf6a5f21629c3914b661d0f5c408eacf1ee7ba
      {/* Image */}
      <div className="h-80 w-full">
        <OptimizedImage
          src={addon.image}
          alt={addon.name?.[lng]}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between space-y-6 p-4 pt-6 pb-3">
        <div className="space-y-4">
          {/* title */}
          <h2 className="text-xl font-semibold">{addon.name?.[lng]}</h2>

          {/* description */}
          <p className="text-sm font-light text-gray-500">{addon.description?.[lng]}</p>

          {/* Price and Status */}
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{priceFormat(addon.price)}</p>
            <p
              className={`${
                addon.is_active ? "bg-main text-white" : "bg-gray-200 text-gray-500"
              } w-fit rounded-4xl px-2 py-1 text-sm font-bold`}
            >
              {addon.is_active ? t("active") : t("not-available")}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-center gap-2 pt-4">
          <Link
            to={`/admin-dashboard/addons/add?edit=${addon._id}`}
            className="bg-main flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-white"
          >
            <Edit2 />
            <span>{t("edit")}</span>
          </Link>

          {/* Delete button */}
          <button onClick={() => setDeletedAddon(addon)}>
            <Trash className="text-main cursor-pointer" />
          </button>
          {/* Change status button */}
          <RadioButton
            initialValue={addon.is_active}
            isPending={isPending}
            callback={(value) => handelUpdateStatus(value, addon._id)}
          />
        </div>
      </div>
    </div>
  );
}
