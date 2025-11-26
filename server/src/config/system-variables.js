// This used to define the status text for the application.
const HTTP_STATUS_TEXT = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
  FAIL: "fail",
});

const USER_ROLE = Object.freeze({
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
});

const PAYMENT_METHOD = Object.freeze({
  CASH: "CASH",
  CARD: "CARD",
});

const BOOKING_PIPELINE = Object.freeze({
  NEW: "new",
  PENDING_PAYMENT: "pending-payment",
  PAID: "paid",
  SCHEDULED: "scheduled",
  IN_STUDIO: "in-studio",
  COMPLETED: "completed",
  NEEDS_EDIT: "needs-edit",
  CANCELED: "canceled",
});

const TAX_RATE = 0.14;

const POLICIES_ROLES = Object.freeze({
  MANAGE_SETTING: "manage:setting",
  MANAGE_DASHBOARD: "manage:dashboard",
  MANAGE_CRM: "manage:crm",
});

// Returns
module.exports = {
  HTTP_STATUS_TEXT,
  USER_ROLE,
  PAYMENT_METHOD,
  TAX_RATE,
  BOOKING_PIPELINE,
  POLICIES_ROLES,
};
