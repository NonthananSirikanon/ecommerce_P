export interface OrderHistoryAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderHistoryItem {
  productId: string;
  productName: string;
  quantity: number;
  price: string;
  totalPrice: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  timestamp: string;
  note: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export interface OrderHistory {
  id: string;
  orderId: string;
  userId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: string;
  currency: string;
  itemCount: number;
  shippingAddress: OrderHistoryAddress;
  billingAddress: OrderHistoryAddress;
  paymentMethod: string;
  trackingNumber?: string;
  shippingProvider?: string;
  orderItems: OrderHistoryItem[];
  paymentDate?: string;
  shippedDate?: string;
  deliveredDate?: string;
  notes?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderHistoryPagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  ordersPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetOrderHistoryResponse {
  success: boolean;
  orderHistory: OrderHistory[];
  pagination: OrderHistoryPagination;
  count: number;
}

export interface GetSingleOrderHistoryResponse {
  success: boolean;
  orderHistory: OrderHistory;
}

export interface CreateOrderHistoryRequest {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus?: PaymentStatus;
  totalAmount: number;
  currency?: string;
  itemCount: number;
  shippingAddress: OrderHistoryAddress;
  billingAddress: OrderHistoryAddress;
  paymentMethod: string;
  orderItems: OrderHistoryItem[];
}

export interface CreateOrderHistoryResponse {
  success: boolean;
  message: string;
  orderHistory: OrderHistory;
}

export interface UpdateOrderHistoryRequest {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  shippingProvider?: string;
  notes?: string;
}

export interface UpdateOrderHistoryResponse {
  success: boolean;
  message: string;
  orderHistory: OrderHistory;
}

export interface GetOrdersByStatusResponse {
  success: boolean;
  orderHistory: OrderHistory[];
  pagination: OrderHistoryPagination;
  count: number;
  filterType: 'order' | 'payment';
  filterStatus: string;
}

export interface OrderHistorySummary {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  paidOrders: number;
  unpaidOrders: number;
  totalSpent: string;
  currency: string;
}

export interface GetOrderHistorySummaryResponse {
  success: boolean;
  summary: OrderHistorySummary;
}

export interface OrderHistoryQueryParams {
  page?: number;
  limit?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
}