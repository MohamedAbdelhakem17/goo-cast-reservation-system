import { createContext, useContext, useEffect, useReducer } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

// Moved the `useAuth` function to a separate file to resolve the Fast Refresh issue.
export const useAuth = () => useContext(AuthContext);

// Updated the AuthProvider to ensure proper token handling and avoid null token issues.
const initialState = {
    isAuthenticated: !!localStorage.getItem('user') && !!localStorage.getItem('token'),
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('token', action.payload.token);
            return {
                isAuthenticated: true,
                user: action.payload,
                token: action.payload.token
            };
        case 'LOGOUT':
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return { ...state, isAuthenticated: false, user: null, token: null };
        default:
            return state;
    }
};

export default function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;
                if (decoded.exp && decoded.exp < now) {
                    dispatch({ type: 'LOGOUT' });
                } else {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        dispatch({ type: 'LOGIN', payload: JSON.parse(storedUser) });
                    }
                }
            } catch (e) {
                console.error("Invalid token", e);
                dispatch({ type: 'LOGOUT' });
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch, isAuthenticated: state.isAuthenticated, user: state.user, token: state.token }}>
            {children}
        </AuthContext.Provider>
    );
}
