import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth-Context/AuthContext';
import LoadingScreen from '../loading-screen/LoadingScreen';
import axios from '../../apis/axiosInstance';

export default function ProtectedRoute({ children, allowedRoles = [], redirectTo = "/" }) {
    const { state, dispatch } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state.isAuthenticated) {
            axios.get('/auth/is-login')
                .then((res) => {
                    if (res.data?.user) {
                        dispatch({ type: 'LOGIN', payload: res.data.user });
                    } else {
                        dispatch({ type: 'LOGOUT' });
                    }
                })
                .catch(() => {
                    dispatch({ type: 'LOGOUT' });
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [state.isAuthenticated, dispatch]);

    if (loading) return <LoadingScreen />;

    if (!state.isAuthenticated) return <Navigate to="/" replace />;

    if (allowedRoles.length > 0 && !allowedRoles.includes(state.user?.role)) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}
