import SYSTEM_ROLES from "./constant/system-roles.constant";

const POLICIES = Object.freeze({
  [SYSTEM_ROLES.ADMIN]: ["manage:setting", "manage:dashboard", "manage:crm"],
  [SYSTEM_ROLES.MANAGER]: ["manage:dashboard", "manage:crm"],
});

const hasPermission = (role, policy) => {
  const availablePolicies = POLICIES[role] || [];
  return availablePolicies.includes(policy);
};

export default hasPermission;
