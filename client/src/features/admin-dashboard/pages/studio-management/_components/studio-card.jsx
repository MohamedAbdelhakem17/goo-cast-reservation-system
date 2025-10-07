import { Edit2, Trash, Camera, TreePine } from "lucide-react";
import usePriceFormat from "@/hooks/usePriceFormat";
import { OptimizedImage, RadioButton } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useLocalization from "@/context/localization-provider/localization-context";
import { useChangeStudioStatus } from "@/apis/admin/manage-studio.api";

export default function StudioCard({ studio, key }) {
  // Localization
  const { t, lng } = useLocalization();

  // mutation
  const { isPending, changeStatus } = useChangeStudioStatus();

  // hooks
  const priceFormat = usePriceFormat();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Functions
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
    <div
      key={key}
      className="group flex flex-col justify-between overflow-hidden rounded-xl bg-white shadow-lg transition hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-80 w-full overflow-hidden">
        <OptimizedImage
          src={studio.thumbnail}
          alt={studio.name?.[lng]}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between space-y-6 p-5">
        <div className="space-y-4">
          {/* title */}
          <h2 className="text-xl font-semibold text-gray-900">{studio.name?.[lng]}</h2>

          {/* description */}
          <p className="line-clamp-2 max-h-12 overflow-hidden text-sm font-light text-gray-500 transition-all duration-500 ease-in-out hover:line-clamp-none hover:max-h-[300px]">
            {studio.description?.[lng]}
          </p>

          {/* Facilities & Equipment */}
          <div className="flex flex-wrap gap-3 pt-2">
            {studio.facilities?.[lng]?.map((f, idx) => (
              <div
                key={`facility-${idx}`}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                <TreePine size={14} className="text-main" />
                {f}
              </div>
            ))}

            {studio.equipment?.[lng]?.map((e, idx) => (
              <div
                key={`equipment-${idx}`}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                <Camera size={14} className="text-main" />
                {e}
              </div>
            ))}
          </div>

          {/* Price and Status */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-main text-2xl font-bold">
              {priceFormat(studio.basePricePerSlot)}
            </p>
            <p
              className={`${
                studio.is_active ? "bg-main text-white" : "bg-gray-200 text-gray-500"
              } w-fit rounded-4xl px-3 py-1 text-sm font-bold`}
            >
              {studio.is_active ? t("active") : t("not-available")}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-center gap-2 pt-4">
          <Link
            to={`/admin-dashboard/studio/add?edit=${studio._id}`}
            className="bg-main hover:bg-main/90 flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-white transition"
          >
            <Edit2 size={16} />
            <span>{t("edit")}</span>
          </Link>

          {/* Delete button */}
          <button
            onClick={() => setDeletedAddon(studio)}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <Trash className="text-main cursor-pointer" size={18} />
          </button>

          {/* Change status button */}
          <RadioButton
            initialValue={studio.is_active}
            isPending={isPending}
            callback={(value) => handelUpdateStatus(value, studio._id)}
          />
        </div>
      </div>
    </div>
  );
}
