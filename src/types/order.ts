export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  total_price: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: {
    id: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  totalAmount: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order: Order;
}