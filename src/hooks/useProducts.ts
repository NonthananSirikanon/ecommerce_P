import { useState, useEffect, useCallback } from 'react';
import { ProductService } from '../utils/productService';
import type { Product, ProductsQueryParams } from '../types/product';

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

interface UseProductsResult extends UseProductsState {
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useProducts = (params?: ProductsQueryParams): UseProductsResult => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await ProductService.getProducts(params);
      
      if (response.success && response.products) {
        setState(prev => ({
          ...prev,
          products: response.products,
          loading: false,
        }));
      } else {
        throw new Error('ไม่สามารถโหลดข้อมูลสินค้าได้');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดสินค้า',
        loading: false,
      }));
    }
  }, [params]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    ...state,
    refetch: fetchProducts,
    clearError,
  };
};

export const useFeaturedProducts = (limit: number = 8): UseProductsResult => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await ProductService.getFeaturedProducts(limit);
      
      if (response.success && response.products) {
        setState(prev => ({
          ...prev,
          products: response.products,
          loading: false,
        }));
      } else {
        throw new Error('ไม่สามารถโหลดข้อมูลสินค้าได้');
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดสินค้า',
        loading: false,
      }));
    }
  }, [limit]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return {
    ...state,
    refetch: fetchFeaturedProducts,
    clearError,
  };
};