import { motion } from 'framer-motion'
import useQuickBooking from '../../../hooks/useQuickBooking'
// import usePriceFormat from '../../../hooks/usePriceFormat'
export default function BookingButton({ studio }) {

    const { handleQuickBooking } = useQuickBooking()


    // const priceFormat = usePriceFormat()
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: .9, type: "spring", stiffness: 100, damping: 15, mass: 0.8 }}
            className="p-4 flex justify-center items-center rounded-lg border-b border-t border-main/50 max-w-3xl mx-auto"
        >
            {/* <p className="text-main font-bold">{priceFormat(studio.price)} per hour</p> */}

            <motion.button onClick={() => handleQuickBooking(2, {
                image: studio.thumbnail,
                name: studio.name,
                price: studio.basePricePerSlot,
                id: studio._id,
            })}
                className="bg-main text-white py-3 px-6 rounded-lg shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Animated background effect on hover */}
                <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{
                        x: "100%",
                        transition: { duration: 0.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }
                    }}
                />
                {/* Text with subtle bounce */}
                <motion.span
                    className="relative z-10"
                    whileHover={{
                        y: [0, -2, 0],
                        transition: {
                            duration: 0.3,
                            repeat: 1
                        }
                    }}
                >
                    Book Now
                </motion.span>
            </motion.button>
        </motion.div>
    )
}
