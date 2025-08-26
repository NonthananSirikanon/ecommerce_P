import { useState, useEffect, useCallback } from 'react';
import { OrderHistoryService } from '../utils/orderHistoryService';
import type {
  OrderHistory,
  OrderHistoryQueryParams,
  OrderStatus,
  PaymentStatus,
  OrderHistorySummary,
  CreateOrderHistoryRequest,
  UpdateOrderHistoryRequest
} from '../types/orderHistory';

interface UseOrderHistoryState {
  orderHistory: OrderHistory[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    ordersPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface UseOrderHistoryResult extends UseOrderHistoryState {
  refetch: (params?: OrderHistoryQueryParams) => Promise<void>;
  createOrderHistory: (orderData: CreateOrderHistoryRequest) => Promise<OrderHistory>;
  updateOrderHistory: (id: string, updateData: UpdateOrderHistoryRequest) => Promise<OrderHistory>;
  clearError: () => void;
}

export const useOrderHistory = (initialParams?: OrderHistoryQueryParams): UseOrderHistoryResult => {
  const [state, setState] = useState<UseOrderHistoryState>({
    orderHistory: [],
    loading: true,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalOrders: 0,
      ordersPerPage: 20,
      hasNextPage: false,
      hasPrevPage: false
    }
  });

  const fetchOrderHistory = useCallback(async (params?: OrderHistoryQueryParams) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await OrderHistoryService.getOrderHistory(params);

      setState(prev => ({
        ...prev,
        orderHistory: response.orderHistory,
        pagination: response.pagination,
        loading: false
      }));
    } catch (err) {
      console.error('Error fetching order history:', err);
      let errorMessage = 'เกิดข้อผิดพลาดในการโหลดประวัติการสั่งซื้อ';

      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('403')) {
          errorMessage = 'กรุณาเข้าสู่ระบบเพื่อดูประวัติการสั่งซื้อ';
        } else {
          errorMessage = err.message;
        }
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
    }
  }, []);

  const createOrderHistory = useCallback(async (orderData: CreateOrderHistoryRequest): Promise<OrderHistory> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const newOrderHistory = await OrderHistoryService.createOrderHistory(orderData);

      setState(prev => ({
        ...prev,
        orderHistory: [newOrderHistory, ...prev.orderHistory]
      }));

      return newOrderHistory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างประวัติการสั่งซื้อ';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const updateOrderHistory = useCallback(async (
    id: string,
    updateData: UpdateOrderHistoryRequest
  ): Promise<OrderHistory> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const updatedOrderHistory = await OrderHistoryService.updateOrderHistory(id, updateData);

      setState(prev => ({
        ...prev,
        orderHistory: prev.orderHistory.map(order =>
          order.id === id ? updatedOrderHistory : order
        )
      }));

      return updatedOrderHistory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตประวัติการสั่งซื้อ';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchOrderHistory(initialParams);
  }, [fetchOrderHistory, initialParams]);

  return {
    ...state,
    refetch: fetchOrderHistory,
    createOrderHistory,
    updateOrderHistory,
    clearError
  };
};

/**
 * Hook for managing a single order history
 */
export const useOrderHistoryDetail = (orderId?: string) => {
  const [orderHistory, setOrderHistory] = useState<OrderHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderHistory = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);
      const orderHistoryData = await OrderHistoryService.getOrderHistoryById(orderId);
      setOrderHistory(orderHistoryData);
    } catch (err) {
      console.error('Error fetching order history:', err);
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลประวัติการสั่งซื้อ';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const updateStatus = useCallback(async (updateData: UpdateOrderHistoryRequest) => {
    if (!orderHistory) return;

    try {
      setError(null);
      const updatedOrderHistory = await OrderHistoryService.updateOrderHistory(orderHistory.id, updateData);
      setOrderHistory(updatedOrderHistory);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตสถานะ';
      setError(errorMessage);
      throw err;
    }
  }, [orderHistory]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  return {
    orderHistory,
    loading,
    error,
    refetch: fetchOrderHistory,
    updateStatus
  };
};

/**
 * Hook for order history statistics
 */
export const useOrderHistoryStats = () => {
  const [stats, setStats] = useState<{
    summary: OrderHistorySummary | null;
    byOrderStatus: Record<OrderStatus, OrderHistory[]>;
    byPaymentStatus: Record<PaymentStatus, OrderHistory[]>;
    loading: boolean;
    error: string | null;
  }>({
    summary: null,
    byOrderStatus: {
      pending: [],
      processing: [],
      shipped: [],
      delivered: [],
      cancelled: [],
      refunded: []
    },
    byPaymentStatus: {
      pending: [],
      processing: [],
      completed: [],
      failed: [],
      cancelled: [],
      refunded: []
    },
    loading: true,
    error: null
  });

  const fetchStats = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Fetch summary statistics
      const summaryResponse = await OrderHistoryService.getOrderHistorySummary();
      
      // Fetch all orders to group by status
      const ordersResponse = await OrderHistoryService.getOrderHistory();
      const allOrders = ordersResponse.orderHistory;

      // Group by order status
      const byOrderStatus = OrderHistoryService.groupOrdersByStatus(allOrders);

      // Group by payment status
      const byPaymentStatus = allOrders.reduce((groups, order) => {
        const status = order.paymentStatus;
        if (!groups[status]) {
          groups[status] = [];
        }
        groups[status].push(order);
        return groups;
      }, {} as Record<PaymentStatus, OrderHistory[]>);

      setStats({
        summary: summaryResponse.summary,
        byOrderStatus: {
          pending: byOrderStatus.pending || [],
          processing: byOrderStatus.processing || [],
          shipped: byOrderStatus.shipped || [],
          delivered: byOrderStatus.delivered || [],
          cancelled: byOrderStatus.cancelled || [],
          refunded: byOrderStatus.refunded || []
        },
        byPaymentStatus: {
          pending: byPaymentStatus.pending || [],
          processing: byPaymentStatus.processing || [],
          completed: byPaymentStatus.completed || [],
          failed: byPaymentStatus.failed || [],
          cancelled: byPaymentStatus.cancelled || [],
          refunded: byPaymentStatus.refunded || []
        },
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching order history stats:', err);
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดสถิติประวัติการสั่งซื้อ';
      setStats(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    ...stats,
    refetch: fetchStats
  };
};