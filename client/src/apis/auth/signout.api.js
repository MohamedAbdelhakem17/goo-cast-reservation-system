import BASE_URL from "../BASE_URL";
import { usePostData } from "../../hooks/useApi";
import { useAuth } from "../../context/Auth-Context/AuthContext";
import { useNavigate } from "react-router-dom";
// const Signout = () => {
//     const userToken = localStorage.getItem("token");

//     const signout = async () => {
//         try {
//             const response = await axios.post(BASE_URL + "/auth/signout", {}, {
//                 headers: {
//                     authorization: "Bearer " + userToken,
//                 },
//             });
//             return response.data;

//         } catch (err) {
//             const message =
//                 err?.response?.data?.message ||
//                 "Something went wrong. Please try again.";
//             console.error("Signout error:", message);
//         }
//     };

//     // Return everything needed for the UI
//     return {
//         signout,
//     };
// };

const Signout = () => {
  const { mutate: signout } = usePostData(
    "signout",
    `${BASE_URL}/auth/signout`
  );
  const { dispatch } = useAuth();
  const navigate = useNavigate();

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
      }
    );
  };

  return { handelLogout };
};

export default Signout;
