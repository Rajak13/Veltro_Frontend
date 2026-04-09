export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Admin
  ADMIN_DASHBOARD: "/dashboard",
  ADMIN_STAFF: "/staff",
  ADMIN_PARTS: "/parts",
  ADMIN_PURCHASE_INVOICES: "/purchase-invoices",
  ADMIN_VENDORS: "/vendors",

  // Staff
  STAFF_DASHBOARD: "/staff-dashboard",
  STAFF_CUSTOMERS: "/customers",
  STAFF_CUSTOMER_DETAIL: (id: number | string) => `/customers/${id}`,
  STAFF_SALES_INVOICES: "/sales-invoices",
  STAFF_SEARCH: "/search",
  STAFF_REPORTS: "/reports",

  // Customer
  CUSTOMER_DASHBOARD: "/customer/dashboard",
  CUSTOMER_APPOINTMENTS: "/customer/appointments",
  CUSTOMER_PART_REQUESTS: "/customer/part-requests",
  CUSTOMER_REVIEWS: "/customer/reviews",
  CUSTOMER_HISTORY: "/customer/history",
  CUSTOMER_PROFILE: "/customer/profile",
} as const;
