import { apiClient } from './api';
import type {
  Payment,
  PaymentMethod,
  PaymentStatus,
  PaymentsResponse,
  SinglePaymentResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  UpdatePaymentStatusRequest,
  UpdatePaymentResponse,
  PaymentsByStatusResponse,
  DeletePaymentResponse,
  PaymentSummary,
} from '../types/payment';

export class PaymentService {
  /**
   * Get all payments for the authenticated user
   */
  static async getPayments(): Promise<PaymentsResponse> {
    return apiClient.get<PaymentsResponse>('/payments');
  }

  /**
   * Get a single payment by ID
   */
  static async getPaymentById(id: string): Promise<Payment> {
    const response = await apiClient.get<SinglePaymentResponse>(`/payments/${id}`);
    return response.payment;
  }

  /**
   * Create a new payment
   */
  static async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    const response = await apiClient.post<CreatePaymentResponse>('/payments', paymentData);
    return response.payment;
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(id: string, statusData: UpdatePaymentStatusRequest): Promise<{
    id: string;
    paymentStatus: PaymentStatus;
    transactionId?: string | null;
    paidAt?: string | null;
    updatedAt: string;
  }> {
    const response = await apiClient.put<UpdatePaymentResponse>(`/payments/${id}/status`, statusData);
    return response.payment;
  }

  /**
   * Get payments by status
   */
  static async getPaymentsByStatus(status: PaymentStatus): Promise<PaymentsByStatusResponse> {
    return apiClient.get<PaymentsByStatusResponse>(`/payments/status/${status}`);
  }

  /**
   * Delete a payment
   */
  static async deletePayment(id: string): Promise<void> {
    await apiClient.delete<DeletePaymentResponse>(`/payments/${id}`);
  }

  /**
   * Format payment amount
   */
  static formatAmount(amount: string | number, currency: string = 'THB'): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(numAmount);
  }

  /**
   * Get payment method label in Thai
   */
  static getPaymentMethodLabel(method: PaymentMethod): string {
    const labels: Record<PaymentMethod, string> = {
      credit_card: 'บัตรเครดิต',
      debit_card: 'บัตรเดบิต',
      bank_transfer: 'โอนเงินผ่านธนาคาร',
      cash: 'เงินสด',
      digital_wallet: 'กระเป๋าเงินดิจิทัล',
    };
    return labels[method];
  }

  /**
   * Get payment status label in Thai
   */
  static getPaymentStatusLabel(status: PaymentStatus): string {
    const labels: Record<PaymentStatus, string> = {
      pending: 'รอดำเนินการ',
      processing: 'กำลังประมวลผล',
      completed: 'สำเร็จ',
      failed: 'ล้มเหลว',
      cancelled: 'ยกเลิก',
      refunded: 'คืนเงิน',
    };
    return labels[status];
  }

  /**
   * Get payment status color for UI
   */
  static getPaymentStatusColor(status: PaymentStatus): {
    bg: string;
    text: string;
    dot: string;
  } {
    const colors = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        dot: 'bg-yellow-500',
      },
      processing: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        dot: 'bg-blue-500',
      },
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        dot: 'bg-green-500',
      },
      failed: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500',
      },
      cancelled: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dot: 'bg-gray-500',
      },
      refunded: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        dot: 'bg-purple-500',
      },
    };
    return colors[status];
  }

  /**
   * Calculate payment summary from payments array
   */
  static calculateSummary(payments: Payment[]): PaymentSummary {
    const summary: PaymentSummary = {
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0,
      failedAmount: 0,
      totalPayments: payments.length,
      completedPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
    };

    payments.forEach((payment) => {
      const amount = parseFloat(payment.amount);
      
      summary.totalAmount += amount;
      
      switch (payment.paymentStatus) {
        case 'completed':
          summary.completedAmount += amount;
          summary.completedPayments += 1;
          break;
        case 'pending':
        case 'processing':
          summary.pendingAmount += amount;
          summary.pendingPayments += 1;
          break;
        case 'failed':
        case 'cancelled':
          summary.failedAmount += amount;
          summary.failedPayments += 1;
          break;
        default:
          break;
      }
    });

    return summary;
  }

  /**
   * Check if payment can be cancelled
   */
  static canCancelPayment(payment: Payment): boolean {
    return ['pending', 'processing'].includes(payment.paymentStatus);
  }

  /**
   * Check if payment can be refunded
   */
  static canRefundPayment(payment: Payment): boolean {
    return payment.paymentStatus === 'completed';
  }

  /**
   * Validate payment creation data
   */
  static validateCreatePayment(data: CreatePaymentRequest): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!data.orderId?.trim()) {
      errors.orderId = 'กรุณาระบุรหัสคำสั่งซื้อ';
    }

    if (!data.amount || data.amount <= 0) {
      errors.amount = 'จำนวนเงินต้องมากกว่า 0';
    }

    if (data.amount && data.amount < 0.01) {
      errors.amount = 'จำนวนเงินต้องไม่น้อยกว่า 0.01';
    }

    if (!data.paymentMethod) {
      errors.paymentMethod = 'กรุณาเลือกวิธีการชำระเงิน';
    }

    if (data.transactionId && data.transactionId.length > 100) {
      errors.transactionId = 'รหัสธุรกรรมต้องไม่เกิน 100 ตัวอักษร';
    }

    if (data.paymentProvider && data.paymentProvider.length > 50) {
      errors.paymentProvider = 'ชื่อผู้ให้บริการต้องไม่เกิน 50 ตัวอักษร';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate payment status update
   */
  static validateUpdatePaymentStatus(data: UpdatePaymentStatusRequest): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!data.paymentStatus) {
      errors.paymentStatus = 'กรุณาระบุสถานะการชำระเงิน';
    }

    if (data.transactionId && data.transactionId.length > 100) {
      errors.transactionId = 'รหัสธุรกรรมต้องไม่เกิน 100 ตัวอักษร';
    }

    if (data.failureReason && data.failureReason.length > 1000) {
      errors.failureReason = 'เหตุผลของความล้มเหลวต้องไม่เกิน 1000 ตัวอักษร';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Format payment date for display
   */
  static formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  /**
   * Get payment provider logo/icon
   */
  static getPaymentProviderIcon(provider?: string | null): string {
    if (!provider) return '💳';
    
    const icons: Record<string, string> = {
      stripe: '💳',
      paypal: '🔵',
      visa: '💙',
      mastercard: '🔴',
      amex: '🟢',
      promptpay: '🟣',
      truemoney: '🔵',
    };
    
    return icons[provider.toLowerCase()] || '💳';
  }
}