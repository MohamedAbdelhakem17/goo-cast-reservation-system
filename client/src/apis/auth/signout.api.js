import {API_BASE_URL} from "@/constants/config";
import { usePostData } from "../../hooks/useApi";
import { useAuth } from "../../context/Auth-Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signout = () => {
    const { mutate: signout } = usePostData("signout", `${API_BASE_URL}/auth/signout`)
    const { dispatch } = useAuth();
    const navigate = useNavigate();

    const handelLogout = () => {
        signout({}, {
            onSuccess: () => {
                dispatch({ type: "LOGOUT" })
                navigate("/")
            },
            onError: (err) => {
                console.error("Logout failed" , err);
            },
        })
    }

    return { handelLogout }
};

export default Signout;
