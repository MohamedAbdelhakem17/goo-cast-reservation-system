import { useMemo, useEffect } from "react";

export default function ImagesInputs({ form }) {
  const imageUrls = useMemo(() => {
    const urls = new Map();

    if (form.values.thumbnail instanceof File) {
      urls.set("thumbnail", URL.createObjectURL(form.values.thumbnail));
    }

    form.values.imagesGallery.forEach((img, index) => {
      if (img instanceof File) {
        urls.set(`image-${index}`, URL.createObjectURL(img));
      }
    });

    return urls;
  }, [form.values.thumbnail, form.values.imagesGallery]);

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setFieldValue("thumbnail", file);
    }
  };

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    const combined = [...form.values.imagesGallery, ...newFiles].slice(0, 5);
    form.setFieldValue("imagesGallery", combined);
  };

  const handleRemoveThumbnail = () => {
    form.setFieldValue("thumbnail", null);
  };

  const handleRemoveImage = (idx) => {
    const arr = form.values.imagesGallery.filter((_, i) => i !== idx);
    form.setFieldValue("imagesGallery", arr);
  };
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  return (
    <div className="rounded-lg bg-gray-50 p-6">
      <label className="mb-4 block text-sm font-medium text-gray-700">Images</label>
      <div className="flex flex-wrap gap-6">
        {/* Thumbnail */}
        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block font-semibold">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="w-full rounded-md border border-gray-300 p-2"
          />
          {form.values.thumbnail && (
            <div className="mt-2">
              <img
                src={
                  form.values.thumbnail instanceof File
                    ? imageUrls.get("thumbnail")
                    : form.values.thumbnail
                }
                alt="Thumbnail"
                className="h-32 w-32 rounded object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                className="mt-1 block text-red-500"
              >
                Remove Thumbnail
              </button>
            </div>
          )}
        </div>

        {/* Images Gallery */}
        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block font-semibold">Images Gallery</label>
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
                    src={img instanceof File ? imageUrls.get(`image-${idx}`) : img}
                    alt={`Gallery ${idx}`}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-xs text-white transition-colors hover:bg-red-700"
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
