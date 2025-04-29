import { useState, useEffect } from 'react'
import { ChangePriceBase } from '../../../../apis/price/price.api'
import { useToast } from '../../../../context/Toaster-Context/ToasterContext'
import Input from '../../../shared/Input/Input'
import { motion } from 'framer-motion'
import { GetStudioByID } from '../../../../apis/studios/studios.api'
import Loading from '../../../shared/Loading/Loading'

export default function ChangeBasePrice({ selectedStudio, closeTab }) {
    const { data: studio, isLoading } = GetStudioByID(selectedStudio);
    const { mutate: changeBasePrice } = ChangePriceBase()
    const { addToast } = useToast()

    const [newData, setNewData] = useState({
        basePricePerSlot: '',
        isFixedHourly: false
    })

    useEffect(() => {
        if (studio?.data) {
            setNewData({
                basePricePerSlot: studio.data.basePricePerSlot,
                isFixedHourly: studio.data.isFixedHourly
            })
        }
    }, [studio])

    const handelUpdatePrice = () => {
        changeBasePrice(
            { id: selectedStudio, payload: newData },
            {
                onSuccess: (response) => {
                    addToast(response.message || "Price Updated Successfully", "success")
                    setNewData({
                        basePricePerSlot: '',
                        isFixedHourly: false
                    })
                    closeTab()
                },
                onError: (error) => {
                    addToast(error?.response?.data?.message || "Something went wrong", "error")
                },
            }
        )
    }

    if (isLoading) return <Loading />

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: .5,
                delay: .2,
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 0.8,
            }} className="my-10">

            <Input
                type="number"
                label="Default Price per Slot"
                value={newData.basePricePerSlot}
                onChange={(e) =>
                    setNewData({ ...newData, basePricePerSlot: +e.target.value })
                }
                min={0}
            />

            <div className="flex items-center mb-6">
                <input
                    type="checkbox"
                    checked={newData.isFixedHourly}
                    onChange={(e) =>
                        setNewData({ ...newData, isFixedHourly: e.target.checked })
                    }
                    className="w-5 h-5 text-rose-500 rounded"
                />
                <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
            </div>

            <button
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded"
                onClick={handelUpdatePrice}
            >
                Update Price
            </button>
        </motion.div>
    )
}
