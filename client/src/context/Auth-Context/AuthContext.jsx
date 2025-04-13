import { createContext, useContext, useEffect, useReducer } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const initialState = {
    isAuthenticated: false,
    token: null,
    user: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
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
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;
                if (decoded.exp && decoded.exp < now) {
                    dispatch({ type: 'LOGOUT' });
                } else {
                    dispatch({ type: 'LOGIN', payload: JSON.parse(storedUser) });
                }
            } catch (e) {
                console.error("Invalid token", e);
                dispatch({ type: 'LOGOUT' });
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
