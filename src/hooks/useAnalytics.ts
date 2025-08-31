import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../utils/analyticsService';
import * as AnalyticsTypes from '../types/analytics';

type DashboardOverview = AnalyticsTypes.DashboardOverview;
type DashboardStats = AnalyticsTypes.DashboardStats;
type OrdersAnalytics = AnalyticsTypes.OrdersAnalytics;
type RevenueAnalytics = AnalyticsTypes.RevenueAnalytics;
type ProductAnalytics = AnalyticsTypes.ProductAnalytics;
type CustomerAnalytics = AnalyticsTypes.CustomerAnalytics;
type SalesAnalytics = AnalyticsTypes.SalesAnalytics;
type OrderStatusDistribution = AnalyticsTypes.OrderStatusDistribution;
type TopSellingProduct = AnalyticsTypes.TopSellingProduct;
type InventoryAlert = AnalyticsTypes.InventoryAlert;
type AnalyticsQueryParams = AnalyticsTypes.AnalyticsQueryParams;

interface UseAnalyticsState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardStats(params?: AnalyticsQueryParams): UseAnalyticsState<DashboardStats> {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getDashboardStats(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useOrdersAnalytics(params?: AnalyticsQueryParams): UseAnalyticsState<OrdersAnalytics> {
  const [data, setData] = useState<OrdersAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getOrdersAnalytics(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useRevenueAnalytics(params?: AnalyticsQueryParams): UseAnalyticsState<RevenueAnalytics> {
  const [data, setData] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getRevenueAnalytics(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useProductAnalytics(params?: AnalyticsQueryParams): UseAnalyticsState<ProductAnalytics> {
  const [data, setData] = useState<ProductAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getProductAnalytics(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useCustomerAnalytics(params?: AnalyticsQueryParams): UseAnalyticsState<CustomerAnalytics> {
  const [data, setData] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getCustomerAnalytics(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// New Admin API Hooks
export function useDashboardOverview(): UseAnalyticsState<DashboardOverview> {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getDashboardOverview();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useSalesAnalytics(params?: AnalyticsQueryParams): UseAnalyticsState<SalesAnalytics> {
  const [data, setData] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getSalesAnalytics(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useOrderStatusDistribution(): UseAnalyticsState<OrderStatusDistribution> {
  const [data, setData] = useState<OrderStatusDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getOrderStatusDistribution();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useTopSellingProducts(limit?: number): UseAnalyticsState<TopSellingProduct[]> {
  const [data, setData] = useState<TopSellingProduct[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getTopSellingProducts(limit);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useInventoryAlerts(threshold?: number): UseAnalyticsState<InventoryAlert[]> {
  const [data, setData] = useState<InventoryAlert[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getInventoryAlerts(threshold);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [threshold]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Combined hook for all analytics data
export function useAllAnalytics(params?: AnalyticsQueryParams) {
  const dashboardStats = useDashboardStats(params);
  const ordersAnalytics = useOrdersAnalytics(params);
  const revenueAnalytics = useRevenueAnalytics(params);
  const productAnalytics = useProductAnalytics(params);
  const customerAnalytics = useCustomerAnalytics(params);

  const loading = dashboardStats.loading || 
                  ordersAnalytics.loading || 
                  revenueAnalytics.loading || 
                  productAnalytics.loading || 
                  customerAnalytics.loading;

  const error = dashboardStats.error || 
                ordersAnalytics.error || 
                revenueAnalytics.error || 
                productAnalytics.error || 
                customerAnalytics.error;

  const refetchAll = async () => {
    await Promise.all([
      dashboardStats.refetch(),
      ordersAnalytics.refetch(),
      revenueAnalytics.refetch(),
      productAnalytics.refetch(),
      customerAnalytics.refetch()
    ]);
  };

  return {
    dashboardStats: dashboardStats.data,
    ordersAnalytics: ordersAnalytics.data,
    revenueAnalytics: revenueAnalytics.data,
    productAnalytics: productAnalytics.data,
    customerAnalytics: customerAnalytics.data,
    loading,
    error,
    refetch: refetchAll
  };
}