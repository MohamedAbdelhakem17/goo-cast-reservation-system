const { USER_ROLE, POLICIES_ROLES } = require("../config/system-variables");

const POLICIES = Object.freeze({
  [USER_ROLE.ADMIN]: [
    POLICIES_ROLES.MANAGE_SETTING,
    POLICIES_ROLES.MANAGE_DASHBOARD,
    POLICIES_ROLES.MANAGE_CRM,
  ],
  [USER_ROLE.MANAGER]: [
    POLICIES_ROLES.MANAGE_DASHBOARD,
    POLICIES_ROLES.MANAGE_CRM,
  ],
});

const hasPermission = (role, policy) => {
  const availablePolicies = POLICIES[role] || [];
  return availablePolicies.includes(policy);
};

module.exports = hasPermission;
