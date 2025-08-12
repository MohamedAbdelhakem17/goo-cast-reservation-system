import { motion, AnimatePresence } from "framer-motion";
import Signin from "@/features/auth/pages/Signin/Signin";
import Signup from "@/features/auth/pages/Signup/Signup";
import { useAuthModel } from "../../../context/Auth-Model-Context/AuthModelContext";

export default function AuthModel() {
  const { isSigninOpen, isSignupOpen, setIsSignupOpen, setIsSigninOpen } =
    useAuthModel();
  return (
    <AnimatePresence mode="wait">
      {(isSignupOpen || isSigninOpen) && (
        <motion.div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {isSignupOpen && (
            <Signup
              closeModal={() => setIsSignupOpen(false)}
              changeForm={() => {
                setIsSignupOpen(false);
                setIsSigninOpen(true);
              }}
            />
          )}
          {isSigninOpen && (
            <Signin
              closeModal={() => setIsSigninOpen(false)}
              changeForm={() => {
                setIsSigninOpen(false);
                setIsSignupOpen(true);
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
