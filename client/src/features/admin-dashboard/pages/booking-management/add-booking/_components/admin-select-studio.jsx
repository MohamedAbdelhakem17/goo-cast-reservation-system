import { useGetStudio } from "@/apis/public/studio.api";
import { OptimizedImage } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { Store } from "lucide-react";

export default function AdminSelectStudio({ selectStudio, selectedStudio }) {
  // Localization
  const { t, lng } = useLocalization();

  // Query
  const { data: studios } = useGetStudio(true);

  // Function
  const handelSelectStudio = ({ name, _id }) => {
    const payload = {
      id: _id,
      name,
    };

    selectStudio("studio", payload);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className="flex items-center text-2xl font-bold">
        <Store className="text-main me-2" />
        {t("select-studio")}
      </h3>

      {/* Studios */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        {studios?.data.map(({ name, _id, thumbnail }) => {
          const isSelected = selectedStudio === _id;

          return (
            <div
              onClick={() => handelSelectStudio({ name, _id })}
              key={_id}
              className={`group relative col-span-1 cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isSelected ? "border-main scale-95 border-2" : "border-gray-200"}`}
            >
              {/* Image Wrapper */}
              <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
                <OptimizedImage
                  src={thumbnail}
                  alt={name?.[lng]}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

                {/* Title Over Image */}
                <h2 className="absolute bottom-3 left-4 z-10 text-lg font-semibold text-white drop-shadow-md">
                  {name?.[lng]}
                </h2>
              </div>

              {/* Selected badge */}
              {isSelected && (
                <span className="border-main text-main absolute end-1 top-5 rounded-lg bg-white p-1 text-sm font-bold">
                  Selected
                </span>
              )}

              {/* Decorative Bottom Bar */}
              <div
                className={`bg-main absolute bottom-0 left-0 h-1 rounded-r-full transition-all duration-300 ${isSelected ? "w-full" : "w-0 group-hover:w-full"}`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
