export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'digital_wallet';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: string;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string | null;
  paymentProvider?: string | null;
  paymentDetails: Record<string, unknown>;
  paidAt?: string | null;
  failureReason?: string | null;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    total_price: string;
    status: string;
  };
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  paymentProvider?: string;
  paymentDetails?: Record<string, unknown>;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: PaymentStatus;
  transactionId?: string;
  failureReason?: string;
}

export interface PaymentsResponse {
  success: boolean;
  payments: Payment[];
  count: number;
}

export interface SinglePaymentResponse {
  success: boolean;
  payment: Payment;
}

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  payment: Payment;
}

export interface UpdatePaymentResponse {
  success: boolean;
  message: string;
  payment: {
    id: string;
    paymentStatus: PaymentStatus;
    transactionId?: string | null;
    paidAt?: string | null;
    updatedAt: string;
  };
}

export interface PaymentsByStatusResponse {
  success: boolean;
  payments: Payment[];
  count: number;
  status: PaymentStatus;
}

export interface DeletePaymentResponse {
  success: boolean;
  message: string;
}

// Utility types for display
export interface PaymentSummary {
  totalAmount: number;
  completedAmount: number;
  pendingAmount: number;
  failedAmount: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
}