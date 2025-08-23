import { useState, useEffect, useCallback, useMemo } from 'react';
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
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
  };
}

export const useProducts = (params?: ProductsQueryParams): UseProductsResult => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalProducts: number;
  } | undefined>();

  // Extract individual params to avoid object reference issues
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const search = params?.search;

  // Memoize params object with stable references
  const stableParams = useMemo(() => ({
    page,
    limit,
    search,
  }), [page, limit, search]);

  const fetchProducts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await ProductService.getProducts(stableParams);
      
      if (response.success && response.products) {
        setState(prev => ({
          ...prev,
          products: response.products,
          loading: false,
        }));

        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error('ไม่สามารถโหลดข้อมูลสินค้าได้');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      let errorMessage = 'เกิดข้อผิดพลาดในการโหลดสินค้า';
      
      if (err instanceof Error) {
        if (err.message.includes('Too Many Requests')) {
          errorMessage = 'เซิร์ฟเวอร์ไม่ว่าง กรุณารอสักครู่แล้วลองใหม่';
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
  }, [stableParams]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    ...state,
    pagination,
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

  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalProducts: number;
  } | undefined>();

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

        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error('ไม่สามารถโหลดข้อมูลสินค้าได้');
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
      let errorMessage = 'เกิดข้อผิดพลาดในการโหลดสินค้า';
      
      if (err instanceof Error) {
        if (err.message.includes('Too Many Requests')) {
          errorMessage = 'เซิร์ฟเวอร์ไม่ว่าง กรุณารอสักครู่แล้วลองใหม่';
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
  }, [limit]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return {
    ...state,
    pagination,
    refetch: fetchFeaturedProducts,
    clearError,
  };
};