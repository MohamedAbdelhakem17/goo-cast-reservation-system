import { useAuth } from "../../context/Auth-Context/AuthContext";
import { usePostData } from "../../hooks/useApi";

const Signout = () => {
  const { mutate: signout } = usePostData("signout", `/auth/signout`);
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
