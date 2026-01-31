import useLocalization from "@/context/localization-provider/localization-context";
import { useEffect, useMemo } from "react";

export default function ImagesInputs({ form }) {
  const { t } = useLocalization();

  const imageUrls = useMemo(() => {
    const urls = new Map();

    const mapIfFile = (key, value) => {
      if (value instanceof File) {
        urls.set(key, URL.createObjectURL(value));
      }
    };

    mapIfFile("thumbnail", form.values.thumbnail);
    mapIfFile("live_view", form.values.live_view);

    form.values.imagesGallery.forEach((img, index) => {
      mapIfFile(`image-${index}`, img);
    });

    return urls;
  }, [form.values.thumbnail, form.values.live_view, form.values.imagesGallery]);

  const getImageSrc = (value, key) => {
    if (!value) return null;
    return value instanceof File ? imageUrls.get(key) : value;
  };

  const handleSingleImageUpload = (field) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setFieldValue(field, file);
    }
  };

  const handleRemoveSingleImage = (field) => () => {
    form.setFieldValue(field, null);
  };

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (!newFiles.length) return;

    const combined = [...form.values.imagesGallery, ...newFiles].slice(0, 5);
    form.setFieldValue("imagesGallery", combined);
  };

  const handleRemoveGalleryImage = (index) => {
    form.setFieldValue(
      "imagesGallery",
      form.values.imagesGallery.filter((_, i) => i !== index),
    );
  };

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  return (
    <div className="rounded-lg bg-gray-50 p-6">
      <label className="mb-4 block text-sm font-medium text-gray-700">
        {t("images")}
      </label>

      <div className="flex flex-wrap gap-6">
        {/* Thumbnail */}
        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block font-semibold">{t("thumbnail")}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleSingleImageUpload("thumbnail")}
            className="w-full rounded-md border border-gray-300 p-2"
          />

          {form.values.thumbnail && (
            <div className="mt-2">
              <img
                src={getImageSrc(form.values.thumbnail, "thumbnail")}
                className="h-32 w-32 rounded object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveSingleImage("thumbnail")}
                className="mt-1 block text-red-500"
              >
                {t("remove-thumbnail")}
              </button>
            </div>
          )}
        </div>

        {/* Live View */}
        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block font-semibold">{t("live-view")}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleSingleImageUpload("live_view")}
            className="w-full rounded-md border border-gray-300 p-2"
          />

          {form.values.live_view && (
            <div className="mt-2">
              <img
                src={getImageSrc(form.values.live_view, "live_view")}
                className="h-32 w-32 rounded object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveSingleImage("live_view")}
                className="mt-1 block text-red-500"
              >
                {t("remove-live-view")}
              </button>
            </div>
          )}
        </div>

        {/* Images Gallery */}
        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block font-semibold">{t("images-gallery")}</label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full rounded-md border border-gray-300 p-2"
          />

          {form.values.imagesGallery.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {form.values.imagesGallery.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded shadow-md"
                >
                  <img
                    src={getImageSrc(img, `image-${idx}`)}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-xs text-white hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
