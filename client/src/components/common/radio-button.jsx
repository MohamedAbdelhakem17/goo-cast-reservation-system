import { useState } from "react";
import { Loader } from "lucide-react";

export default function RadioButton({
  label,
  initialValue = false,
  callback,
  isPending = false,
}) {
  const [isChecked, setIsChecked] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    const newValue = !isChecked;
    setIsLoading(true);

    try {
      const isSuccess = await callback(newValue);

      if (isSuccess !== false) {
        setIsChecked(newValue);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader className="text-main animate-spin" />
      ) : (
        <label className="inline-flex w-fit cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            className="peer sr-only"
            disabled={isPending || isLoading}
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-red-600 peer-focus:ring-4 peer-focus:ring-red-300 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
          {label && (
            <span className="ms-3 text-sm font-medium text-gray-900">{label}</span>
          )}
        </label>
      )}
    </>
  );
}
