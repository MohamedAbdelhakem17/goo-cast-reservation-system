import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { API_BASE_URL } from '@/constants/config';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      return {
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    default:
      return state;
  }
};

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const isValidSession = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/is-login`, {
        withCredentials: true,
      });
      return response.data?.isValid ?? false;
    } catch (err) {
      console.error("Session check failed:", err);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
      }

      const valid = await isValidSession();
      // const valid = true
      if (!valid) {
        dispatch({ type: "LOGOUT" });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
