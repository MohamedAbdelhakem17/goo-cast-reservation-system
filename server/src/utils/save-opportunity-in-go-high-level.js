const axios = require("axios");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.GO_HIGH_LEVEL_API_KEY}`,
  version: process.env.GO_HIGH_LEVEL_VERSION,
};

// Function to create a new contact in Go High Level
const createContact = async (contactData) => {
  const url = process.env.GO_HIGH_LEVEL_URL + "/contacts";
  const body = {
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.contact.id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Create contact error:", error.response?.data);
      console.error("Status code:", error.response?.status);
    }
    throw error;
  }
};

// Function to get the contact ID from Go High Level
// If the contact does not exist, create a new one
const getContactID = async (userData) => {
  const url = process.env.GO_HIGH_LEVEL_URL + "/contacts/search/";
  const body = {
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    pageLimit: 1,
    filters: [
      {
        field: "email",
        operator: "eq",
        value: userData.email,
      },
    ],
  };

  try {
    const response = await axios.post(url, body, { headers });
    const contactId = response?.data?.contacts[0]?.id;
    const isContactIdExists = Boolean(contactId);
    return isContactIdExists ? contactId : await createContact(userData);
  } catch (error) {
    console.error("Error fetching contact ID:", error.response?.data);
    throw error;
  }
};


const createOpportunity = async (opportunityData) => {
  const url = "https://services.leadconnectorhq.com/opportunities/";
  const body = {
    locationId: process.env.GO_HIGH_LEVEL_LOCATION_ID,
    pipelineId: process.env.GO_HIGH_LEVEL_PIPELINE_ID,
    pipelineStageId: process.env.GO_HIGH_LEVEL_PIPELINE_STAGE_ID,
    contactId: opportunityData.contactId,
    monetaryValue: opportunityData.price,
    name: opportunityData.name,
    source: "Goocast Booking Website",
    status: "open",
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.opportunity.id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response || {};

      console.error("Create opportunity error:", data);
      console.error("Status code:", status);

      if (
        status === 409 ||
        (data?.message && data.message.includes("already exists"))
      ) {
        console.warn("Opportunity already exists or was created, skipping.");
        return null;
      }
    }

    throw error;
  }
};

const saveOpportunityInGoHighLevel = async (userData, opportunityData) => {
  const contactId = await getContactID(userData);
  opportunityData.contactId = contactId;
  await createOpportunity(opportunityData);
};

module.exports = saveOpportunityInGoHighLevel;
