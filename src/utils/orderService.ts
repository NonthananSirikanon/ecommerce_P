import { apiClient } from './api';
import type { Order, CreateOrderRequest, CreateOrderResponse } from '../types/order';

export class OrderService {
  /**
   * Create a new order using simple-orders API (for regular users)
   */
  static async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      // ใช้ simple-orders API ที่รองรับ user ทั่วไป
      const response = await apiClient.post<CreateOrderResponse>('/simple-orders', orderData);
      return response.order;
    } catch (error) {
      console.error('OrderService.createOrder error:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  }

  /**
   * Format order total price
   */
  static formatPrice(price: string | number): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(numPrice);
  }
}