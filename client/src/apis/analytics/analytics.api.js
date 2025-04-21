import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import BASE_URL from "../BASE_URL";

export const GetDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboardStats"],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/analytics/dashboard-stats`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return data;
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                throw error;
            }
        },
    });
};

export const GetPageAnalytics = () => {
    return useQuery({
        queryKey: ["pageAnalytics"],
        queryFn: async () => {
            try {
                const response = await axios.get("http://localhost:9090/api/v1/analytics", {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                return response.data.data;
            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
        }
    });
};

