import { createContext, useContext, useState, useMemo } from "react";

const AuthModelContext = createContext();

export default function AuthModelProvider({ children }) {
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isSigninOpen, setIsSigninOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    const toggleSignin = () => setIsSigninOpen(prev => !prev);
    const toggleSignup = () => setIsSignupOpen(prev => !prev);

    const BUTTON_ACTIONS = useMemo(() => [
        { name: "Login", action: toggleSignin },
        { name: "Sign Up", action: toggleSignup },
    ], []);

    const value = useMemo(() => ({
        BUTTON_ACTIONS,
        isSigninOpen,
        isSignupOpen,
        setIsSigninOpen,
        setIsSignupOpen,
        isMobileMenuOpen, setIsMobileMenuOpen
    }), [BUTTON_ACTIONS, isSigninOpen, isSignupOpen, isMobileMenuOpen]);

    return (
        <AuthModelContext.Provider value={value}>
            {children}
        </AuthModelContext.Provider>
    );
}

export const useAuthModel = () => useContext(AuthModelContext);
