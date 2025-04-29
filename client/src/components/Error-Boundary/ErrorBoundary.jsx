import React from "react";
import { motion } from "framer-motion";  // Importing motion from Framer Motion
import BASE_URL from "../../apis/BASE_URL";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("Uncaught error:", error, errorInfo);
        // Send error details to backend
        const sendToApi = fetch(BASE_URL + "/error-notification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                error: error.toString(),
                stack: errorInfo.componentStack,
                userAgent: navigator.userAgent,
                url: window.location.href,
            }),
        });

        // sendToApi()


    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <motion.div
                    className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center">
                        <motion.div
                            className="text-2xl font-bold text-gray-700 mb-4"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            Something Went Wrong
                        </motion.div>
                        <motion.p
                            className="text-lg text-gray-600 mb-8"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            We are experiencing some technical issues. Please try again later.
                        </motion.p>
                        <motion.button
                            className="py-3 px-8 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-lg"
                            onClick={() => window.location.reload()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Try Again
                        </motion.button>
                    </div>
                </motion.div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
