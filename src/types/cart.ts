import type { Product } from './product';

export interface BackendCartItem {
  id: string;
  productId: string;
  productName: string;
  productDescription: string;
  productImage: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
  variant: string | null;
}

export interface BackendCart {
  id: string;
  userId: string;
  items: BackendCartItem[];
  totalAmount: number;
  itemCount: number;
}

export interface BackendCartResponse {
  success: boolean;
  cart: BackendCart;
}

export interface AddToCartResponse {
  success: boolean;
  message: string;
  item: BackendCartItem;
  cartTotal: number;
}

export interface UpdateCartItemResponse {
  success: boolean;
  message: string;
  item: BackendCartItem;
  cartTotal: number;
}

export interface RemoveItemResponse {
  success: boolean;
  message: string;
  cartTotal: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    quantity: number; 
  };
  quantity: number; 
  totalPrice: number;
  variant: string | null;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  itemCount: number;
}

export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
}

export interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variant?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}