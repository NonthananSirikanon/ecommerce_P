import { apiClient } from './api';
import type {
  OrderHistory,
  OrderHistoryQueryParams,
  GetOrderHistoryResponse,
  GetSingleOrderHistoryResponse,
  CreateOrderHistoryRequest,
  CreateOrderHistoryResponse,
  UpdateOrderHistoryRequest,
  UpdateOrderHistoryResponse,
  GetOrdersByStatusResponse,
  GetOrderHistorySummaryResponse,
  OrderStatus,
  PaymentStatus
} from '../types/orderHistory';

export class OrderHistoryService {
  /**
   * Get all order history with optional filters and pagination
   */
  static async getOrderHistory(params?: OrderHistoryQueryParams): Promise<GetOrderHistoryResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.orderStatus) queryParams.append('orderStatus', params.orderStatus);
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);

    const queryString = queryParams.toString();
    const url = `/order-history${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<GetOrderHistoryResponse>(url);
  }

  /**
   * Get single order history by ID
   */
  static async getOrderHistoryById(id: string): Promise<OrderHistory> {
    const response = await apiClient.get<GetSingleOrderHistoryResponse>(`/order-history/${id}`);
    return response.orderHistory;
  }

  /**
   * Get order history by order number
   */
  static async getOrderHistoryByOrderNumber(orderNumber: string): Promise<OrderHistory> {
    const response = await apiClient.get<GetSingleOrderHistoryResponse>(`/order-history/order-number/${orderNumber}`);
    return response.orderHistory;
  }

  /**
   * Create new order history
   */
  static async createOrderHistory(orderData: CreateOrderHistoryRequest): Promise<OrderHistory> {
    const response = await apiClient.post<CreateOrderHistoryResponse>('/order-history', orderData);
    return response.orderHistory;
  }

  /**
   * Update order history
   */
  static async updateOrderHistory(id: string, updateData: UpdateOrderHistoryRequest): Promise<OrderHistory> {
    const response = await apiClient.put<UpdateOrderHistoryResponse>(`/order-history/${id}`, updateData);
    return response.orderHistory;
  }

  /**
   * Get orders by order status
   */
  static async getOrdersByStatus(
    status: OrderStatus,
    params?: { page?: number; limit?: number }
  ): Promise<GetOrdersByStatusResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = `/order-history/status/order/${status}${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<GetOrdersByStatusResponse>(url);
  }

  /**
   * Get orders by payment status
   */
  static async getOrdersByPaymentStatus(
    status: PaymentStatus,
    params?: { page?: number; limit?: number }
  ): Promise<GetOrdersByStatusResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = `/order-history/status/payment/${status}${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<GetOrdersByStatusResponse>(url);
  }

  /**
   * Get order history summary statistics
   */
  static async getOrderHistorySummary(): Promise<GetOrderHistorySummaryResponse> {
    return apiClient.get<GetOrderHistorySummaryResponse>('/order-history/stats/summary');
  }

  /**
   * Format price with Thai currency
   */
  static formatPrice(price: string | number): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(numPrice);
  }

  /**
   * Format date to Thai locale
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get order status display text in Thai
   */
  static getOrderStatusText(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      pending: 'รอดำเนินการ',
      processing: 'กำลังประมวลผล',
      shipped: 'จัดส่งแล้ว',
      delivered: 'ส่งแล้ว',
      cancelled: 'ยกเลิกแล้ว',
      refunded: 'คืนเงินแล้ว'
    };
    return statusMap[status] || status;
  }

  /**
   * Get payment status display text in Thai
   */
  static getPaymentStatusText(status: PaymentStatus): string {
    const statusMap: Record<PaymentStatus, string> = {
      pending: 'รอชำระเงิน',
      processing: 'กำลังประมวลผล',
      completed: 'ชำระเงินแล้ว',
      failed: 'ชำระไม่สำเร็จ',
      cancelled: 'ยกเลิกแล้ว',
      refunded: 'คืนเงินแล้ว'
    };
    return statusMap[status] || status;
  }

  /**
   * Get status color for UI display
   */
  static getStatusColor(status: OrderStatus | PaymentStatus): string {
    const colorMap: Record<string, string> = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100',
      completed: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
      refunded: 'text-gray-600 bg-gray-100',
      failed: 'text-red-600 bg-red-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  }

  /**
   * Calculate total items count
   */
  static calculateTotalItems(orderHistory: OrderHistory[]): number {
    return orderHistory.reduce((total, order) => total + order.itemCount, 0);
  }

  /**
   * Calculate total amount from order history list
   */
  static calculateTotalAmount(orderHistory: OrderHistory[]): number {
    return orderHistory.reduce((total, order) => total + parseFloat(order.totalAmount), 0);
  }

  /**
   * Group orders by status
   */
  static groupOrdersByStatus(orderHistory: OrderHistory[]): Record<OrderStatus, OrderHistory[]> {
    return orderHistory.reduce((groups, order) => {
      const status = order.orderStatus;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(order);
      return groups;
    }, {} as Record<OrderStatus, OrderHistory[]>);
  }

  /**
   * Filter orders by date range
   */
  static filterOrdersByDateRange(
    orderHistory: OrderHistory[],
    dateFrom?: string,
    dateTo?: string
  ): OrderHistory[] {
    return orderHistory.filter(order => {
      const orderDate = new Date(order.createdAt);
      
      if (dateFrom && orderDate < new Date(dateFrom)) {
        return false;
      }
      
      if (dateTo && orderDate > new Date(dateTo)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Get payment method display text
   */
  static getPaymentMethodText(method: string): string {
    const methodMap: Record<string, string> = {
      credit_card: 'บัตรเครดิต/เดบิต',
      digital_wallet: 'กระเป๋าเงินดิจิทัล',
      bank_transfer: 'โอนเงินผ่านธนาคาร',
      cash_on_delivery: 'เก็บเงินปลายทาง'
    };
    return methodMap[method] || method;
  }
}