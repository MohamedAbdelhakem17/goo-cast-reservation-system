import React from "react";
import useLocalization from "@/context/localization-provider/localization-context";
import * as LucideIcons from "lucide-react";
import usePriceFormat from "@/hooks/usePriceFormat";
import { Link } from "react-router-dom";
import { RadioButton } from "@/components/common";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useChangePackageStatus } from "@/apis/admin/manage-package.api";

export default function PackageCard({ pkg, key, setSelectedDeletedPackage }) {
  // Localization
  const { t, lng } = useLocalization();

  // Mutation
  const { isPending, changeStatus } = useChangePackageStatus();

  // hooks
  const pieceFormate = usePriceFormat();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // variables
  const IconComponent = LucideIcons[pkg.icon] || null;

  // Functions
  const handelUpdateStatus = (value, id) => {
    return new Promise((resolve, reject) => {
      changeStatus(
        { payload: value, id },
        {
          onSuccess: () => {
            addToast("Change status successfully", "success");
            queryClient.invalidateQueries("packages");
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

  return (
    <div
      className="flex flex-col justify-between gap-y-4 overflow-hidden rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
      key={key || pkg._id}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* price , name and icon  */}
        <div className="flex items-center gap-3">
          {/* icon */}
          <div className="bg-main/90 rounded-md p-2 text-white">
            {/* {React.createElement(IconComponent)} */}
          </div>

          {/* price and name */}
          <div>
            <h3 className="font-semibold text-gray-900">{pkg.name?.[lng]}</h3>
            <p className="text-main text-xl font-bold">{pieceFormate(pkg.price)}</p>
          </div>
        </div>

        {/* status */}
        <span
          className={`${pkg.is_active ? "bg-main text-white" : "bg-gray-200 text-gray-400"} rounded-xl px-3 py-1.5 text-sm font-medium`}
        >
          {pkg.is_active ? t("active") : t("inactive")}
        </span>
      </div>

      <div className="space-y-4">
        {/* Main description */}
        {pkg.description?.[lng] && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-2">
              <LucideIcons.FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-600" />
              <p className="text-sm leading-relaxed text-slate-700">
                {pkg.description[lng]}
              </p>
            </div>
          </div>
        )}

        {/* Details */}
        {pkg.details?.[lng]?.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <LucideIcons.List className="h-4 w-4 text-slate-600" />
              <h4 className="text-sm font-medium text-slate-900">{t("details")}</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pkg.details[lng].map((detail, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {detail}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Post session benefits */}
        {pkg.post_session_benefits?.[lng]?.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <LucideIcons.CheckCircle className="h-4 w-4 text-slate-600" />
              <h4 className="text-sm font-medium text-slate-900">{t("benefits")}</h4>
            </div>
            <div className="space-y-1.5">
              {pkg.post_session_benefits[lng].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <LucideIcons.Check className="mt-1 h-3 w-3 flex-shrink-0 text-slate-500" />
                  <span className="text-sm text-slate-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Target audience */}
        {pkg.target_audience?.[lng]?.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <LucideIcons.Users className="h-4 w-4 text-slate-600" />
              <h4 className="text-sm font-medium text-slate-900">
                {t("target-audience")}
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pkg.target_audience[lng].map((audience, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center justify-center gap-2 border-t border-slate-200 pt-4">
        <Link
          to={`/admin-dashboard/service/add?edit=${pkg._id}`}
          className="bg-main hover:bg-main/90 flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-white transition-colors"
        >
          <LucideIcons.Edit2 className="h-4 w-4" />
          <span>{t("edit")}</span>
        </Link>

        {/* Delete button */}
        <button
          onClick={() => setSelectedDeletedPackage(pkg)}
          className="group rounded-md p-3 transition-colors hover:bg-slate-50"
        >
          <LucideIcons.Trash className="h-4 w-4 cursor-pointer text-red-500 group-hover:text-red-600" />
        </button>

        {/* Change status button */}
        <RadioButton
          initialValue={pkg.is_active}
          isPending={isPending}
          callback={(value) => handelUpdateStatus(value, pkg._id)}
        />
      </div>
    </div>
  );
}
