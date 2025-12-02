import { useGetAddons } from "@/apis/admin/manage-addons.api";
import { useGetAllPackages } from "@/apis/admin/manage-package.api";
import { useGetStudio } from "@/apis/public/studio.api";
import { Input, SelectInput } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";

export default function DetailsTab({ values, setFieldValue }) {
  const { t, lng } = useLocalization();

  // Query
  const { data: studios } = useGetStudio(true);
  const { packages } = useGetAllPackages(true);
  const { addons } = useGetAddons(true);

  // Helpers for selectedAddOns (array)
  const selectedAddOns = values.selectedAddOns || [];

  const getAddon = (id) => selectedAddOns.find((a) => a.id === id);

  const isChecked = (id) => !!getAddon(id);

  const getQuantity = (id) => getAddon(id)?.quantity || 0;

  const updateAddon = (addon, quantity) => {
    const existing = getAddon(addon._id);
    let updated = [];

    if (!existing && quantity > 0) {
      // Add new addon
      updated = [
        ...selectedAddOns,
        {
          id: addon._id,
          name: addon.name,
          price: addon.price,
          quantity,
        },
      ];
    } else if (existing && quantity === 0) {
      // Remove addon
      updated = selectedAddOns.filter((a) => a.id !== addon._id);
    } else if (existing && quantity > 0) {
      // Update quantity
      updated = selectedAddOns.map((a) => (a.id === addon._id ? { ...a, quantity } : a));
    }

    setFieldValue("selectedAddOns", updated);
  };

  const BOOKING_STATUS = [
    { id: "new", label: "New" },
    { id: "paid", label: "Paid" },
    { id: "completed", label: "Completed" },
    { id: "canceled", label: "Canceled" },
  ];

  return (
    <div className="flex h-[60vh] flex-col gap-y-5 overflow-auto px-3">
      {/* Studio */}
      <SelectInput
        label="Select Studio"
        value={values.studio || ""}
        className="!mb-0 w-full [&>div]:rounded-xl [&>div]:px-4 [&>div]:py-3"
        onChange={(e) => setFieldValue("studio", e.target.value)}
        name="studio"
        options={
          studios?.data?.map((s) => ({
            label: s?.name[lng],
            value: s?._id,
          })) || [{ label: "loading", value: "" }]
        }
      />

      {/* Package */}
      <SelectInput
        label="Select Package"
        value={values.selectedPackage || ""}
        className="!mb-0 w-full [&>div]:rounded-xl [&>div]:px-4 [&>div]:py-3"
        onChange={(e) => setFieldValue("selectedPackage", e.target.value)}
        name="package"
        options={
          packages?.data?.map((p) => ({
            label: p?.name[lng],
            value: p?._id,
          })) || [{ label: "loading", value: "" }]
        }
      />

      {/* Addons */}
      <div className="flex flex-col gap-3">
        <p className="mb-2 block text-sm font-semibold text-gray-700">Addons</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {addons?.data?.map((addon) => {
            const quantity = getQuantity(addon._id);
            const checked = isChecked(addon._id);

            return (
              <label
                key={addon._id}
                className={`group flex items-center justify-between gap-3 rounded-xl border p-4 shadow-sm transition-all ${
                  checked ? "border-main bg-primary/10" : "border-gray-200 bg-white"
                } cursor-pointer hover:shadow-md`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => updateAddon(addon, checked ? 0 : 1)}
                    className="text-primary accent-primary h-5 w-5 rounded transition duration-200"
                  />

                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-700">{addon.name[lng]}</span>
                    <span className="font-semibold text-gray-500">{addon.price} EGP</span>
                  </div>
                </div>

                {checked && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        updateAddon(addon, quantity - 1);
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-gray-700 transition hover:bg-gray-300"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>

                    <span className="w-6 text-center">{quantity}</span>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        updateAddon(addon, quantity + 1);
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-gray-700 transition hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Booking Status */}
      <SelectInput
        label="Payment Status"
        value={values.status || "new"}
        className="!mb-0 w-full [&>div]:rounded-xl [&>div]:px-4 [&>div]:py-3"
        onChange={(e) => setFieldValue("status", e.target.value)}
        name="status"
        options={
          BOOKING_STATUS?.map((b) => ({
            label: b.label,
            value: b.id,
          })) || [{ label: "loading", value: "" }]
        }
      />

      {/* Duration */}
      <Input
        className="!mt-5"
        type="number"
        id="duration"
        label={"Duration"}
        placeholder={"Session Duration"}
        value={values.duration}
        onChange={(e) => setFieldValue("duration", e.target.value)}
      />
    </div>
  );
}
