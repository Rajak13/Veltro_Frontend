export const ROLES = {
  ADMIN: "Admin",
  STAFF: "Staff",
  CUSTOMER: "Customer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
