// All TypeScript interfaces matching backend models exactly

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Staff" | "Customer";
  createdAt: string;
}

export interface Vehicle {
  id: number;
  customerId: number;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  mileage?: number;
}

export interface Customer {
  id: number;
  userId: number;
  user: User;
  phone: string;
  address: string;
  loyaltyPoints: number;
  vehicles: Vehicle[];
  createdAt: string;
}

export interface Staff {
  id: number;
  userId: number;
  user: User;
  phone: string;
  position: string;
  createdAt: string;
}

export interface Vendor extends Record<string, unknown> {
  vendorId: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

export interface Part extends Record<string, unknown> {
  partId: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  vendorName: string;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesInvoiceItem {
  id: number;
  salesInvoiceId: number;
  partId: number;
  part?: Part;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SalesInvoice {
  id: number;
  customerId: number;
  customer?: Customer;
  staffId: number;
  staff?: Staff;
  items: SalesInvoiceItem[];
  totalAmount: number;
  discountApplied: number;
  finalAmount: number;
  status: "Pending" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface PurchaseInvoiceItem {
  itemId: string;
  partId: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PurchaseInvoice extends Record<string, unknown> {
  invoiceId: string;
  vendorId: string;
  vendorName: string;
  totalAmount: number;
  purchaseDate: string;
  notes?: string;
  items: PurchaseInvoiceItem[];
}

export interface Appointment {
  id: number;
  customerId: number;
  customer?: Customer;
  vehicleId: number;
  vehicle?: Vehicle;
  scheduledDate: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
  createdAt: string;
}

export interface PartRequest {
  id: number;
  customerId: number;
  customer?: Customer;
  partName: string;
  description: string;
  status: "Pending" | "Sourced" | "Unavailable";
  createdAt: string;
}

export interface Review {
  id: number;
  customerId: number;
  customer?: Customer;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
