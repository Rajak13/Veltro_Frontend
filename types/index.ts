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

export interface Vendor {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Part {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stockQuantity: number;
  vendorId: number;
  vendor?: Vendor;
  createdAt: string;
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
  id: number;
  purchaseInvoiceId: number;
  partId: number;
  part?: Part;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseInvoice {
  id: number;
  vendorId: number;
  vendor?: Vendor;
  staffId: number;
  staff?: Staff;
  items: PurchaseInvoiceItem[];
  totalAmount: number;
  status: "Pending" | "Received" | "Cancelled";
  createdAt: string;
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

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
