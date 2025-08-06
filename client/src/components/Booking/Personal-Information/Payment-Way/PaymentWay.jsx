import { useState } from "react";
import {CreditCard, Banknote } from 'lucide-react';
import { useBooking } from "../../../../context/Booking-Context/BookingContext";

const paymentMethods = [
    {
        id: "CARD",
        label: "Credit/Debit Card",
        description: "Pay securely online with Visa, Mastercard, or American Express",
        icon: <CreditCard />,
    },
    {
        id: "CASH",
        label: "Pay at Studio (Cash)",
        description: "Pay with cash when you arrive at the studio",
        icon: <Banknote />,
    },
];

export default function PaymentOptions() {
    const [selected, setSelected] = useState("CARD");
    const { setBookingField } = useBooking();

    return (
        <div className="max-w-full mx-auto py-6 space-y-4 ">
            {paymentMethods.map(({ id, label, description, icon }) => (
                <div
                    key={id}
                    className={`cursor-pointer border rounded-lg p-4 bg-white flex items-center gap-3  border-gray-300`}
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
                        <div className="flex items-center gap-2 mb-1 text-lg font-medium text-gray-900">
                            {icon}
                            {label}
                        </div>
                        <p className="text-sm text-gray-500">{description}</p>
                    </label>
                </div>
            ))}

            {selected === "CARD" && <div className="mt-2 bg-gray-100 p-4 rounded text-sm text-gray-600">
                Payment will be processed securely through our payment partner. You will be redirected to complete your payment after confirming your booking.
                <br />
                <span className="text-xs text-gray-500 block mt-2">We accept all major credit cards, PayPal, and bank transfers.</span>
            </div>}

            {
                selected === "CASH" && <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg ">
                    <div className="flex items-start">
                        <div className="text-amber-600 mr-2">ℹ️</div>
                        <div className="text-sm text-amber-700">
                            <p className="mb-2"><strong>Cash Payment Information:</strong></p>
                            <ul className="text-xs space-y-1 list-disc list-inside">
                                <li>Please bring exact change if possible</li>
                                <li>Payment is due at the start of your session</li>
                                <li>We'll provide a receipt for your records</li>
                                <li>Cancellations must be made 24 hours in advance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
