import { createContext, useContext, useEffect, useReducer } from "react";

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
    } else {
      dispatch({ type: "LOGOUT" });
    }
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
