import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from "../../apis/axiosInstance";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const initialState = {
    isAuthenticated: false,
    user: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                isAuthenticated: true,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                isAuthenticated: false,
                user: null,
            };
        default:
            return state;
    }
};

export default function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        axios.get('/auth/is-login')
            .then((res) => {
                if (res.data?.user) {
                    dispatch({ type: 'LOGIN', payload: res.data.user });
                }
            })
            .catch(() => {
                dispatch({ type: 'LOGOUT' });
            });
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch, isAuthenticated: state.isAuthenticated, user: state.user }}>
            {children}
        </AuthContext.Provider>
    );
}
