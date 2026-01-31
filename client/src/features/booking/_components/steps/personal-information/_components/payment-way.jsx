import useLocalization from "@/context/localization-provider/localization-context";
import { Banknote } from "lucide-react";
import { useState } from "react";

export default function PaymentOptions({ setBookingField, showInfo = true }) {
  // Localization
  const { t } = useLocalization();

  //   State
  const [selected, setSelected] = useState("CASH");

  //   VAriables
  const paymentMethods = [
    // {
    //     id: "CARD",
    //     label: "Credit/Debit Card",
    //     description: "Pay securely online with Visa, Mastercard, or American Express",
    //     icon: <CreditCard />,
    // },
    {
      id: "CASH",
      label: t("pay-at-studio-cash"),
      description: t("pay-with-cash-when-you-arrive-at-the-studio"),
      icon: <Banknote />,
    },
  ];

  const cashNotes = [
    t("please-bring-exact-change-if-possible"),
    t("payment-is-due-at-the-start-of-your-session"),
    t("well-provide-a-receipt-for-your-records"),
    t("cancellations-must-be-made-24-hours-in-advance"),
  ];

  return (
    <div className="mx-auto max-w-full space-y-4 py-6">
      {paymentMethods.map(({ id, label, description, icon }) => (
        <div
          key={id}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white p-4 transition-colors dark:border-gray-600 dark:bg-gray-800`}
          onClick={() => {
            setSelected(id);
            setBookingField("paymentMethod", id);
          }}
        >
          <input
            type="radio"
            id={id}
            name="payment"
            value={id}
            checked={selected === id}
            onChange={() => setSelected(id)}
            className="mt-1 accent-red-600"
          />
          <label htmlFor={id} className="ms-4 flex-1 cursor-pointer">
            <div className="mb-1 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              {icon}
              {label}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </label>
        </div>
      ))}

      {selected === "CARD" && (
        <div className="mt-2 rounded bg-gray-100 p-4 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          {t(
            "payment-will-be-processed-securely-through-our-payment-partner-you-will-be-redirected-to-complete-your-payment-after-confirming-your-booking",
          )}
          <br />
          <span className="mt-2 block text-xs text-gray-500 dark:text-gray-500">
            {t(
              "we-accept-all-major-credit-cards-paypal-and-bank-transfers-less-than-span-greater-than",
            )}{" "}
          </span>
        </div>
      )}

      {selected === "CASH" && showInfo && (
        <div className="mt-4 p-4">
          <div className="flex items-start">
            {/* <div className="me-2 text-gray-300">ℹ️</div> */}
            <div className="text-base text-gray-500 dark:text-gray-400">
              {/* <p className="mb-2">
                <strong>{t("cash-payment-information")}</strong>
              </p> */}
              <ul className="list-inside list-disc space-y-1 text-xs">
                {cashNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
