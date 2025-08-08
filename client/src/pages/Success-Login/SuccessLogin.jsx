import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function SuccessLogin() {
    React.useEffect(() => {
        setTimeout(() => {
            if (window.opener && !window.opener.closed) {
                window.opener.location.href = '/';
            }
            window.close();
        }, 1000);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen  bg-green-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
                <CheckCircle className="text-green-500" size={48} />
                <h1 className="text-2xl font-bold text-green-600">Login Successful!</h1>
                <p className="text-gray-600">You will be redirected to the homepage...</p>
            </div>
        </div>
    );
}