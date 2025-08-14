const axios = require("axios");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.GO_HIGH_LEVEL_API_KEY}`,
  version: process.env.GO_HIGH_LEVEL_VERSION,
};

const changeOpportunityStatus = async (id, status) => {
  const url = `${process.env.GO_HIGH_LEVEL_URL}/opportunities/${id}/status`;
  const body = {
    status,
  };

  try {
    const response = await axios.put(url, body, { headers });
    console.log("✅ Opportunity status changed:", response.data);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Change opportunity status error:", error.response?.data);
      return false;
    }
  }
};

module.exports = changeOpportunityStatus;
