import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth-Context/AuthContext';
import { LoadingScreen } from '@/components/common';

export default function ProtectedRoute({ children, allowedRoles = [], redirectTo = "/" }) {
    const { state, dispatch } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            dispatch({ type: 'LOGIN', payload: JSON.parse(storedUser) });
        } else {
            dispatch({ type: 'LOGOUT' });
        }

        setLoading(false);
    }, [dispatch]);

    if (loading) return <LoadingScreen />;

    if (!state.isAuthenticated) return <Navigate to="/" replace />;

    if (allowedRoles.length > 0 && !allowedRoles.includes(state.user?.role)) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}
