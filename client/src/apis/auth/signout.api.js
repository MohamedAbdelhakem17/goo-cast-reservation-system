import { API_BASE_URL } from "@/constants/config";
import { usePostData } from "../../hooks/useApi";
import { useAuth } from "../../context/Auth-Context/AuthContext";

const Signout = () => {
  const { mutate: signout } = usePostData("signout", `${API_BASE_URL}/auth/signout`);
  const { dispatch } = useAuth();

  const handelLogout = () => {
    signout(
      {},
      {
        onSuccess: () => {
          dispatch({ type: "LOGOUT" });
          location.href = "/";
        },
        onError: (err) => {
          console.error("Logout failed", err);
        },
      },
    );
  };

  return { handelLogout };
};

export default Signout;
