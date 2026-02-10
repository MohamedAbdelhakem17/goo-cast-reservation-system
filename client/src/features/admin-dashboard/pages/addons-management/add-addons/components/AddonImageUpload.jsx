import { ErrorFeedback, OptimizedImage } from "@/components/common";
import { useImageUpload } from "../hooks/useImageUpload";

/**
 * Addon image upload component with preview
 */
export const AddonImageUpload = ({ form, t }) => {
  const { displayUrl } = useImageUpload(form.values.image);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setFieldValue("image", file);
    }
  };

  return (
    <div className="col-span-2">
      <label className="mb-2 block font-semibold">{t("thumbnail")}</label>
      <input
        id="image"
        name="image"
        type="file"
        accept="image/*"
        className="w-full rounded-md border border-gray-300 p-2"
        onChange={handleImageUpload}
        onBlur={form.handleBlur}
      />
      {form.touched.image && form.errors.image && (
        <ErrorFeedback>{form.errors.image}</ErrorFeedback>
      )}
      {displayUrl && (
        <OptimizedImage
          src={displayUrl}
          alt="Thumbnail"
          className="mt-2 h-32 w-32 rounded object-cover"
        />
      )}
    </div>
  );
};
