import axios from "axios";
import BASE_URL from "../BASE_URL";

const Signout = () => {
    const userToken = localStorage.getItem("token");

    const signout = async () => {
        try {
            const response = await axios.post(BASE_URL + "/auth/signout", {}, {
                headers: {
                    authorization: "Bearer " + userToken,
                },
            });
            return response.data;
            
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";
            console.error("Signout error:", message);
        }
    };

    // Return everything needed for the UI
    return {
        signout,
    };
};

export default Signout;
