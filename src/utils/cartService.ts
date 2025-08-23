import { apiClient } from './api';
import type { 
  BackendCartResponse, 
  AddToCartResponse,
  UpdateCartItemResponse,
  RemoveItemResponse,
  AddToCartRequest, 
  UpdateCartItemRequest,
  CartItem,
  BackendCartItem 
} from '../types/cart';

export class CartService {
  static async getCart(): Promise<BackendCartResponse> {
    return apiClient.get<BackendCartResponse>('/simple-cart');
  }

  static async addToCart(request: AddToCartRequest): Promise<AddToCartResponse> {
    return apiClient.post<AddToCartResponse>('/simple-cart/add', request);
  }

  static async updateCartItem(itemId: string, request: UpdateCartItemRequest): Promise<UpdateCartItemResponse> {
    return apiClient.put<UpdateCartItemResponse>(`/simple-cart/items/${itemId}`, request);
  }

  static async removeFromCart(itemId: string): Promise<RemoveItemResponse> {
    return apiClient.delete<RemoveItemResponse>(`/simple-cart/items/${itemId}`);
  }

  static async clearCart(): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>('/simple-cart/clear');
  }

  static convertBackendItemToFrontend(backendItem: BackendCartItem): CartItem {
    return {
      id: backendItem.id,
      productId: backendItem.productId,
      product: {
        id: backendItem.productId,
        name: backendItem.productName,
        description: backendItem.productDescription,
        price: backendItem.price,
        image: backendItem.productImage,
        quantity: backendItem.quantity, 
      },
      quantity: backendItem.quantity,
      totalPrice: backendItem.totalPrice,
      variant: backendItem.variant,
    };
  }

  static convertBackendItemsToFrontend(backendItems: BackendCartItem[]): CartItem[] {
    return backendItems.map(this.convertBackendItemToFrontend);
  }
}