import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationVariants } from '../../hooks/useAnimationVariants';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const variants = useAnimationVariants();

    const addToast = useCallback((message, type = 'info', duration = 1500) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const getToastStyles = useCallback((type) => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            default:
                return 'bg-main text-white';
        }
    }, []);

    const getToastIcon = useCallback((type) => {
        switch (type) {
            case 'success':
                return 'fa-circle-check';
            case 'error':
                return 'fa-circle-xmark';
            case 'warning':
                return 'fa-triangle-exclamation';
            default:
                return 'fa-circle-info';
        }
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div
                className="fixed top-4 right-4 z-50 space-y-2"
                aria-live="polite"
                aria-atomic="true"
            >
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            variants={variants.slideIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`
                flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg
                ${getToastStyles(toast.type)}
              `}
                            role="alert"
                        >
                            <i className={`fa-solid ${getToastIcon(toast.type)}`} aria-hidden="true" />
                            <p className="font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-auto p-1 hover:opacity-80 focus:outline-none"
                                aria-label="Close notification"
                            >
                                <i className="fa-solid fa-xmark" aria-hidden="true" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}; 