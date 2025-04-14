import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/Auth-Context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles, redirectTo = "/" }) {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);  
    const { dispatch } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;
                if (decoded.exp && decoded.exp < now) {
                    dispatch({ type: 'LOGOUT' });
                    setUserRole(null);
                } else {
                    setUserRole(decoded.role);
                }
            } catch (error) {
                console.error('Invalid token', error);
                dispatch({ type: 'LOGOUT' });
                setUserRole(null);
            }
        } else {
            setUserRole(null);  // No token found, set userRole to null
        }

        setLoading(false);  // Set loading to false once the effect is complete
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRole]);

    if (loading) {
        return null;  // Show nothing while the role is being determined
    }

    if (userRole === null) {
        return <Navigate to="/" replace />;  // Redirect to home page if no role
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to={redirectTo} replace />;  // Redirect to the specified page if role is not allowed
    }

    return children;  // If everything is good, render the children
}
