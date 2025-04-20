import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/Auth-Context/AuthContext';
import LoadingScreen from '../loading-screen/LoadingScreen';
import Signout from '../../apis/auth/signout.api';

export default function ProtectedRoute({ children, allowedRoles, redirectTo = "/" }) {
    const [userRole, setUserRole] = useState(null);
    const { signout } = Signout()
    const [loading, setLoading] = useState(true);
    const { dispatch } = useAuth();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                signout();
                dispatch({ type: 'LOGOUT' });
                <Navigate to="/" replace />;
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;

                if (decoded.exp && decoded.exp < now) {
                    dispatch({ type: 'LOGOUT' });
                } else {
                    setUserRole(decoded.role);
                }
            } catch (err) {
                console.error("Invalid token", err);
                dispatch({ type: 'LOGOUT' });
            }
        };

        checkToken();
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!userRole) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}
