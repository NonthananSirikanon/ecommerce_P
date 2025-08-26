import { useState, useEffect, useCallback } from 'react';
import { PaymentService } from '../utils/paymentService';
import type {
  Payment,
  PaymentStatus,
  CreatePaymentRequest,
  UpdatePaymentStatusRequest,
  PaymentSummary,
} from '../types/payment';

interface UsePaymentsState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  summary: PaymentSummary;
}

interface UsePaymentsResult extends UsePaymentsState {
  refetch: () => Promise<void>;
  createPayment: (paymentData: CreatePaymentRequest) => Promise<Payment>;
  updatePaymentStatus: (id: string, statusData: UpdatePaymentStatusRequest) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  getPaymentsByStatus: (status: PaymentStatus) => Promise<Payment[]>;
  clearError: () => void;
}

export const usePayments = (): UsePaymentsResult => {
  const [state, setState] = useState<UsePaymentsState>({
    payments: [],
    loading: true,
    error: null,
    summary: {
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0,
      failedAmount: 0,
      totalPayments: 0,
      completedPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
    },
  });

  const fetchPayments = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await PaymentService.getPayments();
      const summary = PaymentService.calculateSummary(response.payments);

      setState(prev => ({
        ...prev,
        payments: response.payments,
        summary,
        loading: false,
      }));
    } catch (err) {
      console.error('Error fetching payments:', err);
      let errorMessage = 'เกิดข้อผิดพลาดในการโหลดข้อมูลการชำระเงิน';

      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('403')) {
          errorMessage = 'กรุณาเข้าสู่ระบบเพื่อดูข้อมูลการชำระเงิน';
        } else {
          errorMessage = err.message;
        }
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    }
  }, []);

  const createPayment = useCallback(async (paymentData: CreatePaymentRequest): Promise<Payment> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const newPayment = await PaymentService.createPayment(paymentData);

      setState(prev => {
        const updatedPayments = [...prev.payments, newPayment];
        const summary = PaymentService.calculateSummary(updatedPayments);
        
        return {
          ...prev,
          payments: updatedPayments,
          summary,
        };
      });

      return newPayment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างการชำระเงิน';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const updatePaymentStatus = useCallback(async (
    id: string,
    statusData: UpdatePaymentStatusRequest
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const updatedPayment = await PaymentService.updatePaymentStatus(id, statusData);

      setState(prev => {
        const updatedPayments = prev.payments.map(payment => {
          if (payment.id === id) {
            return {
              ...payment,
              paymentStatus: updatedPayment.paymentStatus,
              transactionId: updatedPayment.transactionId,
              paidAt: updatedPayment.paidAt,
              updatedAt: updatedPayment.updatedAt,
            };
          }
          return payment;
        });
        
        const summary = PaymentService.calculateSummary(updatedPayments);
        
        return {
          ...prev,
          payments: updatedPayments,
          summary,
        };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงิน';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const deletePayment = useCallback(async (id: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      await PaymentService.deletePayment(id);

      setState(prev => {
        const updatedPayments = prev.payments.filter(payment => payment.id !== id);
        const summary = PaymentService.calculateSummary(updatedPayments);
        
        return {
          ...prev,
          payments: updatedPayments,
          summary,
        };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบการชำระเงิน';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const getPaymentsByStatus = useCallback(async (status: PaymentStatus): Promise<Payment[]> => {
    try {
      const response = await PaymentService.getPaymentsByStatus(status);
      return response.payments;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลการชำระเงิน';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    ...state,
    refetch: fetchPayments,
    createPayment,
    updatePaymentStatus,
    deletePayment,
    getPaymentsByStatus,
    clearError,
  };
};

/**
 * Hook for managing a single payment
 */
export const usePayment = (paymentId: string) => {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayment = useCallback(async () => {
    if (!paymentId) return;

    try {
      setLoading(true);
      setError(null);
      const paymentData = await PaymentService.getPaymentById(paymentId);
      setPayment(paymentData);
    } catch (err) {
      console.error('Error fetching payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลการชำระเงิน';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  const updateStatus = useCallback(async (statusData: UpdatePaymentStatusRequest) => {
    if (!payment) return;

    try {
      setError(null);
      const updatedPayment = await PaymentService.updatePaymentStatus(payment.id, statusData);
      
      setPayment(prev => prev ? {
        ...prev,
        paymentStatus: updatedPayment.paymentStatus,
        transactionId: updatedPayment.transactionId,
        paidAt: updatedPayment.paidAt,
        updatedAt: updatedPayment.updatedAt,
      } : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตสถานะ';
      setError(errorMessage);
      throw err;
    }
  }, [payment]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  return {
    payment,
    loading,
    error,
    refetch: fetchPayment,
    updateStatus,
  };
};

/**
 * Hook for payment statistics
 */
export const usePaymentStats = () => {
  const [stats, setStats] = useState<{
    byStatus: Record<PaymentStatus, number>;
    byMethod: Record<string, number>;
    recentPayments: Payment[];
    loading: boolean;
    error: string | null;
  }>({
    byStatus: {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      refunded: 0,
    },
    byMethod: {},
    recentPayments: [],
    loading: true,
    error: null,
  });

  const fetchStats = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      const response = await PaymentService.getPayments();
      const payments = response.payments;

      // Calculate stats
      const byStatus: Record<PaymentStatus, number> = {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        cancelled: 0,
        refunded: 0,
      };

      const byMethod: Record<string, number> = {};

      payments.forEach(payment => {
        byStatus[payment.paymentStatus]++;
        byMethod[payment.paymentMethod] = (byMethod[payment.paymentMethod] || 0) + 1;
      });

      // Get recent payments (last 10)
      const recentPayments = payments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

      setStats({
        byStatus,
        byMethod,
        recentPayments,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error fetching payment stats:', err);
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดสถิติการชำระเงิน';
      setStats(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    ...stats,
    refetch: fetchStats,
  };
};