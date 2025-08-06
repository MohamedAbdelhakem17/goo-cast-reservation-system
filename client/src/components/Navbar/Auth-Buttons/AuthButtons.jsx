import { motion } from "framer-motion";
import { useAuthModel } from '../../../context/Auth-Model-Context/AuthModelContext'

export function AuthButtons() {
    const { BUTTON_ACTIONS } = useAuthModel()

    const buttonVariants = {
        hover: { scale: 1.05, boxShadow: "0 4px 10px rgba(237,30,38,0.3)" },
        tap: { scale: 0.95, boxShadow: "0 2px 5px rgba(237,30,38,0.2)" },
    };
    return (
        <div className="hidden md:flex items-center space-x-4">
            {BUTTON_ACTIONS.map((btn, i) => (
                <motion.button
                    key={i}
                    onClick={btn.action}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`${i === 0
                        ? "bg-white text-main/90 border border-main/50 hover:bg-blue-50"
                        : "bg-main/90 text-white hover:bg-main"
                        } px-5 py-2 rounded-md font-medium`}
                >
                    {btn.name}
                </motion.button>
            ))}
        </div>
    )
}

export function MobileAuthButtons({ setIsMobileMenuOpen }) {
    const { BUTTON_ACTIONS } = useAuthModel()
    const fadeItem = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return <div className="space-y-3">
        {BUTTON_ACTIONS.map((button, i) => (
            <motion.button
                key={i}
                variants={fadeItem}
                whileHover="hover"
                whileTap="tap"
                className={`${i === 0
                    ? "bg-white text-main/90 border border-main/50 hover:bg-blue-50"
                    : "bg-main/90 text-white hover:bg-main"
                    } px-5 py-2 rounded-md font-medium w-full`}
                onClick={() => {
                    button.action();
                    setIsMobileMenuOpen(false);
                }}
            >
                {button.name}
            </motion.button>
        ))}
    </div>
}