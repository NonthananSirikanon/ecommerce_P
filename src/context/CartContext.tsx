/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, useEffect } from 'react';
import type { CartState, CartContextType, CartItem, CartSummary } from '../types/cart';
import type { Product } from '../types/product';
import { CartService } from '../utils/cartService';
import { AuthService } from '../utils/authService';
import { authEvents } from '../utils/events';

export const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'CLEAR_CART_LOCAL' };

const calculateSummary = (items: CartItem[]): CartSummary => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    totalItems,
    totalPrice,
    itemCount: items.length,
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_CART': {
      const newItems = action.payload;
      return {
        ...state,
        items: newItems,
        summary: calculateSummary(newItems),
        isLoading: false,
        error: null,
      };
    }
    
    case 'CLEAR_CART_LOCAL':
      return {
        ...state,
        items: [],
        summary: calculateSummary([]),
        isLoading: false,
        error: null,
      };
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  summary: calculateSummary([]),
  isLoading: false,
  error: null,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Sync cart from backend when user is authenticated
  const syncCart = async () => {
    const isAuthenticated = AuthService.isAuthenticated();
    
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_CART_LOCAL' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await CartService.getCart();
      
      if (response.success && response.cart) {
        const frontendItems = CartService.convertBackendItemsToFrontend(response.cart.items);
        dispatch({ type: 'SET_CART', payload: frontendItems });
      } else {
        dispatch({ type: 'SET_CART', payload: [] });
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      
      // Check if it's a specific error type
      if (error instanceof Error) {
        if (error.message.includes('Too many')) {
          dispatch({ type: 'SET_ERROR', payload: 'เซิร์ฟเวอร์ไม่ว่าง กรุณาลองใหม่ในอีกสักครู่' });
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          dispatch({ type: 'SET_ERROR', payload: 'กรุณาเข้าสู่ระบบใหม่' });
        } else if (error.message.includes('Invalid JSON')) {
          dispatch({ type: 'SET_ERROR', payload: 'เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง' });
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'ไม่สามารถโหลดตะกร้าสินค้าได้' });
        }
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'ไม่สามารถโหลดตะกร้าสินค้าได้' });
      }
    }
  };

  // Sync cart on mount and when auth state changes
  useEffect(() => {
    syncCart();

    // Listen for auth events
    const handleAuthLogin = () => {
      syncCart();
    };

    const handleAuthLogout = () => {
      dispatch({ type: 'CLEAR_CART_LOCAL' });
    };

    authEvents.on('auth:login', handleAuthLogin);
    authEvents.on('auth:logout', handleAuthLogout);

    return () => {
      authEvents.off('auth:login', handleAuthLogin);
      authEvents.off('auth:logout', handleAuthLogout);
    };
  }, []);

  const addItem = async (product: Product, quantity: number = 1) => {
    if (!AuthService.isAuthenticated()) {
      throw new Error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await CartService.addToCart({
        productId: product.id.toString(),
        quantity,
      });

      if (response.success) {
        // After adding item, fetch the full cart to get updated state
        await syncCart();
      } else {
        throw new Error(response.message || 'ไม่สามารถเพิ่มสินค้าได้');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' });
      throw error;
    }
  };

  const removeItem = async (productId: string) => {
    const cartItem = state.items.find(item => item.productId === productId);
    if (!cartItem) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await CartService.removeFromCart(cartItem.id);

      if (response.success) {
        // After removing item, fetch the full cart to get updated state
        await syncCart();
      } else {
        throw new Error(response.message || 'ไม่สามารถลบสินค้าได้');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบสินค้า' });
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const cartItem = state.items.find(item => item.productId === productId);
    if (!cartItem) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await CartService.updateCartItem(cartItem.id, { quantity });

      if (response.success) {
        // After updating item, fetch the full cart to get updated state
        await syncCart();
      } else {
        throw new Error(response.message || 'ไม่สามารถอัปเดตจำนวนสินค้าได้');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตสินค้า' });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await CartService.clearCart();
      dispatch({ type: 'CLEAR_CART_LOCAL' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการล้างตะกร้า' });
      throw error;
    }
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some(item => item.productId === productId);
  };

  const value: CartContextType = {
    items: state.items,
    summary: state.summary,
    isLoading: state.isLoading,
    error: state.error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    syncCart,
    getItemQuantity,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};