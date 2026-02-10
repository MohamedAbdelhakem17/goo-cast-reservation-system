import Select from "react-select";
import { selectStyles } from "../addon-form.utils";

/**
 * Reusable multi-select component for packages
 */
export const PackageSelector = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder,
  helpText,
}) => {
  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value));

  const handleChange = (selected) => {
    const packageIds = selected ? selected.map((opt) => opt.value) : [];
    onChange(packageIds);
  };

  return (
    <div className="mb-4">
      <label className="mb-2 block font-semibold">{label}</label>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        className="basic-multi-select"
        classNamePrefix="select"
        styles={selectStyles}
      />
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  );
};
