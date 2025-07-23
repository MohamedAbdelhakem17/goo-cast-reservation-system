import { useState } from "react"
import { DollarSign } from "lucide-react"

export default function PaymentOptions() {
    const [selected, setSelected] = useState("cash")

    return (
        <div className="max-w-2xl mx-auto p-6">
          
                <div className="space-y-4">
                    {/* Cash Option */}
                    <div
                        className={`cursor-pointer border rounded-lg p-4 flex items-center space-x-3 ${selected === "cash"
                                ? "bg-blue-50 border-blue-500"
                                : "bg-white border-gray-300"
                            }`}
                        onClick={() => setSelected("cash")}
                    >
                        <input
                            type="radio"
                            id="cash"
                            name="payment"
                            value="cash"
                            checked={selected === "cash"}
                            onChange={() => setSelected("cash")}
                            className="accent-blue-600"
                        />
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-white" />
                            </div>
                            <label htmlFor="cash" className="text-lg font-medium text-gray-900">
                                Cash
                            </label>
                        </div>
                    </div>

                    {/* Credit Card Option */}
                    <div
                        className={`cursor-pointer border rounded-lg p-4 flex flex-col space-y-3 ${selected === "credit"
                                ? "bg-blue-50 border-blue-500"
                                : "bg-white border-gray-300"
                            }`}
                        onClick={() => setSelected("credit")}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    id="credit"
                                    name="payment"
                                    value="credit"
                                    checked={selected === "credit"}
                                    onChange={() => setSelected("credit")}
                                    className="accent-blue-600"
                                />
                                <label
                                    htmlFor="credit"
                                    className="text-lg font-medium text-gray-900"
                                >
                                    Credit card
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                {/* Visa */}
                                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">VISA</span>
                                </div>
                                {/* Mastercard */}
                                <div className="w-10 h-6 flex items-center justify-center">
                                    <div className="flex">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full -ml-1"></div>
                                    </div>
                                </div>
                                {/* Amex */}
                                <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">AMEX</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}
