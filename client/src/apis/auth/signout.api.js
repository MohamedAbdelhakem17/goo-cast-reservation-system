import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import BASE_URL from "../BASE_URL";
import { useAuth } from "../../context/Auth-Context/AuthContext";

const Signout = () => {
    const { token } = useAuth()

    // useMutation for signout request
    const { mutate: signout } = useMutation({
        mutationFn: async () => {
            const response = await axios.post(BASE_URL + "/auth/signout", {}, {
                headers: {
                    authorization: `Bearer ${token}`
                },
            });
            return response.data;
        },
        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";
        },
    });

    // Return everything needed for the UI
    return {
        signout
    };
};

export default Signout;
