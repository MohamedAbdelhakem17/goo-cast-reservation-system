import { motion, AnimatePresence } from "framer-motion";
import Signin from "@/features/auth/pages/signin/signin";
import Signup from "@/features/auth/pages/signup/signup";
import { useAuthModel } from "@/context/Auth-Model-Context/AuthModelContext";

export default function AuthModel() {
  const { isSigninOpen, isSignupOpen, setIsSignupOpen, setIsSigninOpen } = useAuthModel();
  return (
    <AnimatePresence mode="wait">
      {(isSignupOpen || isSigninOpen) && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 px-4 backdrop-blur-sm"
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
