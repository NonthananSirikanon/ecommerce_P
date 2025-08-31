import { apiClient } from './api';
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
type MonthlyData = AnalyticsTypes.MonthlyData;
type RecentOrder = AnalyticsTypes.RecentOrder;
type ProductStock = AnalyticsTypes.ProductStock;
type TopProduct = AnalyticsTypes.TopProduct;
type TopCustomer = AnalyticsTypes.TopCustomer;

class AnalyticsService {
  
  // Dashboard Overview Stats
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: DashboardOverview;
      }>('/admin/dashboard/overview');

      if (response.success) {
        return response.data;
      }
      
      throw new Error('Failed to fetch dashboard overview');
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      return this.getMockDashboardOverview();
    }
  }

  // Legacy Dashboard Stats (for backward compatibility)
  async getDashboardStats(_params?: AnalyticsQueryParams): Promise<DashboardStats> {
    try {
      const overview = await this.getDashboardOverview();
      // Convert new format to legacy format
      return {
        totalRevenue: overview.totalSales.value,
        totalOrders: overview.totalOrders.value,
        totalCustomers: overview.totalUsers.value,
        totalProducts: 0, // Not available in new API
        revenueGrowth: parseFloat(overview.totalSales.change),
        ordersGrowth: parseFloat(overview.totalOrders.change),
        customersGrowth: parseFloat(overview.totalUsers.change),
        productsGrowth: 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return this.getMockDashboardStats();
    }
  }

  // Sales Analytics with Date Range
  async getSalesAnalytics(params?: AnalyticsQueryParams): Promise<SalesAnalytics> {
    try {
      const queryString = this.buildQueryString(params);
      const response = await apiClient.get<{
        success: boolean;
        data: SalesAnalytics;
      }>(`/admin/dashboard/sales${queryString}`);

      if (response.success) {
        return response.data;
      }
      
      throw new Error('Failed to fetch sales analytics');
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      return this.getMockSalesAnalytics();
    }
  }

  // Order Status Distribution
  async getOrderStatusDistribution(): Promise<OrderStatusDistribution> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: OrderStatusDistribution;
      }>('/admin/dashboard/orders/status');

      if (response.success) {
        return response.data;
      }
      
      throw new Error('Failed to fetch order status distribution');
    } catch (error) {
      console.error('Error fetching order status distribution:', error);
      return this.getMockOrderStatusDistribution();
    }
  }

  // Top Selling Products
  async getTopSellingProducts(limit: number = 10): Promise<TopSellingProduct[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: TopSellingProduct[];
      }>(`/admin/dashboard/products/top?limit=${limit}`);

      if (response.success) {
        return response.data;
      }
      
      throw new Error('Failed to fetch top selling products');
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      return this.getMockTopSellingProducts();
    }
  }

  // Inventory Alerts
  async getInventoryAlerts(threshold: number = 10): Promise<InventoryAlert[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: InventoryAlert[];
      }>(`/admin/dashboard/inventory/alerts?threshold=${threshold}`);

      if (response.success) {
        return response.data;
      }
      
      throw new Error('Failed to fetch inventory alerts');
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      return this.getMockInventoryAlerts();
    }
  }

  // Refresh Analytics Data
  async refreshAnalytics(): Promise<boolean> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>('/admin/dashboard/analytics/refresh');

      return response.success;
    } catch (error) {
      console.error('Error refreshing analytics:', error);
      return false;
    }
  }

  // Orders Analytics
  async getOrdersAnalytics(_params?: AnalyticsQueryParams): Promise<OrdersAnalytics> {
    try {
      const [ordersResponse, recentOrdersResponse] = await Promise.all([
        apiClient.get<{ success: boolean; data: Record<string, unknown> }>('/analytics/orders'),
        apiClient.get<{ success: boolean; orders: RecentOrder[] }>('/orders?limit=10&sort=-createdAt')
      ]);

      const ordersData = ordersResponse.success ? ordersResponse.data : {};
      const recentOrders = recentOrdersResponse.success ? recentOrdersResponse.orders : [];

      return {
        totalOrders: ordersData.total || 0,
        pendingOrders: ordersData.pending || 0,
        completedOrders: ordersData.completed || 0,
        cancelledOrders: ordersData.cancelled || 0,
        ordersByMonth: ordersData.monthlyOrders || this.getMockMonthlyData('orders'),
        ordersByStatus: ordersData.statusDistribution || this.getMockStatusData(),
        recentOrders: recentOrders || this.getMockRecentOrders()
      };
    } catch (error) {
      console.error('Error fetching orders analytics:', error);
      return this.getMockOrdersAnalytics();
    }
  }

  // Revenue Analytics
  async getRevenueAnalytics(_params?: AnalyticsQueryParams): Promise<RevenueAnalytics> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: RevenueAnalytics;
      }>('/analytics/revenue');

      if (response.success) {
        return response.data;
      }
      
      throw new Error('Failed to fetch revenue analytics');
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return this.getMockRevenueAnalytics();
    }
  }

  // Product Analytics
  async getProductAnalytics(_params?: AnalyticsQueryParams): Promise<ProductAnalytics> {
    try {
      const [productsResponse, lowStockResponse, topProductsResponse] = await Promise.all([
        apiClient.get<{ success: boolean; data: Record<string, unknown> }>('/analytics/products'),
        apiClient.get<{ success: boolean; products: ProductStock[] }>('/products?stock_lt=10'),
        apiClient.get<{ success: boolean; products: TopProduct[] }>('/analytics/products/top-selling')
      ]);

      const productsData = productsResponse.success ? productsResponse.data : {};
      const lowStockProducts = lowStockResponse.success ? lowStockResponse.products : [];
      const topProducts = topProductsResponse.success ? topProductsResponse.products : [];

      return {
        totalProducts: productsData.total || 0,
        lowStockProducts: lowStockProducts || this.getMockLowStockProducts(),
        topSellingProducts: topProducts || this.getMockTopProducts(),
        categoryDistribution: productsData.categoryDistribution || this.getMockCategoryData(),
        productsByStatus: productsData.statusDistribution || this.getMockProductStatusData()
      };
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      return this.getMockProductAnalytics();
    }
  }

  // Customer Analytics
  async getCustomerAnalytics(_params?: AnalyticsQueryParams): Promise<CustomerAnalytics> {
    try {
      const [customersResponse, topCustomersResponse] = await Promise.all([
        apiClient.get<{ success: boolean; data: Record<string, unknown> }>('/analytics/customers'),
        apiClient.get<{ success: boolean; customers: TopCustomer[] }>('/analytics/customers/top')
      ]);

      const customersData = customersResponse.success ? customersResponse.data : {};
      const topCustomers = topCustomersResponse.success ? topCustomersResponse.customers : [];

      return {
        totalCustomers: customersData.total || 0,
        newCustomersThisMonth: customersData.newThisMonth || 0,
        customerGrowth: customersData.growth || 0,
        customersByMonth: customersData.monthlyCustomers || this.getMockMonthlyData('customers'),
        topCustomers: topCustomers || this.getMockTopCustomers()
      };
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      return this.getMockCustomerAnalytics();
    }
  }

  // Helper Methods
  private buildQueryString(params?: AnalyticsQueryParams): string {
    if (!params) return '';
    
    const searchParams = new URLSearchParams();
    
    if (params.timeRange) {
      searchParams.set('start', params.timeRange.start);
      searchParams.set('end', params.timeRange.end);
    }
    
    if (params.period) {
      searchParams.set('period', params.period);
    }
    
    if (params.category) {
      searchParams.set('category', params.category);
    }
    
    if (params.status) {
      searchParams.set('status', params.status);
    }
    
    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // Mock Data Methods (fallback when API is not available)
  private getMockDashboardOverview(): DashboardOverview {
    return {
      totalSales: {
        value: 15420.50,
        change: "12.5",
        isPositive: true
      },
      totalOrders: {
        value: 45,
        change: "-3.2",
        isPositive: false
      },
      totalUsers: {
        value: 1250,
        change: "2.1",
        isPositive: true
      },
      newUsers: {
        value: 15,
        change: "25.0",
        isPositive: true
      },
      avgOrderValue: {
        value: 342.68,
        change: "8.9",
        isPositive: true
      },
      conversionRate: {
        value: 0.036,
        change: "1.5",
        isPositive: true
      }
    };
  }

  private getMockSalesAnalytics(): SalesAnalytics {
    return {
      period: 'daily',
      data: [
        { date: '2024-01-01', sales: 1200, orders: 5, avgOrderValue: 240 },
        { date: '2024-01-02', sales: 1500, orders: 7, avgOrderValue: 214 },
        { date: '2024-01-03', sales: 1800, orders: 8, avgOrderValue: 225 },
        { date: '2024-01-04', sales: 1100, orders: 4, avgOrderValue: 275 },
        { date: '2024-01-05', sales: 2200, orders: 9, avgOrderValue: 244 }
      ],
      totalSales: 15420.50,
      totalOrders: 45,
      growth: {
        sales: 12.5,
        orders: -3.2
      }
    };
  }

  private getMockOrderStatusDistribution(): OrderStatusDistribution {
    return {
      pending: 8,
      processing: 12,
      shipped: 15,
      delivered: 28,
      cancelled: 3,
      returned: 2
    };
  }

  private getMockTopSellingProducts(): TopSellingProduct[] {
    return [
      {
        id: 1,
        name: 'PlayStation 5',
        image: '/images/ps5.jpg',
        unitsSold: 45,
        revenue: 22500,
        growth: 15.2,
        category: 'คอนโซลเกม'
      },
      {
        id: 2,
        name: 'Grand Theft Auto VI',
        image: '/images/gta6.jpg',
        unitsSold: 38,
        revenue: 19000,
        growth: 8.7,
        category: 'เกมคอนโซล'
      },
      {
        id: 3,
        name: 'Xbox Series X',
        image: '/images/xbox.jpg',
        unitsSold: 32,
        revenue: 16000,
        growth: -2.1,
        category: 'คอนโซลเกม'
      }
    ];
  }

  private getMockInventoryAlerts(): InventoryAlert[] {
    return [
      {
        id: 1,
        name: 'PlayStation 5 Controller',
        currentStock: 3,
        threshold: 10,
        status: 'low',
        lastRestocked: '2024-01-10'
      },
      {
        id: 2,
        name: 'Xbox Game Pass Ultimate',
        currentStock: 0,
        threshold: 5,
        status: 'out_of_stock',
        lastRestocked: '2024-01-05'
      },
      {
        id: 3,
        name: 'Nintendo Switch Pro Controller',
        currentStock: 2,
        threshold: 15,
        status: 'critical',
        lastRestocked: '2024-01-08'
      }
    ];
  }

  private getMockDashboardStats(): DashboardStats {
    return {
      totalRevenue: 1250000,
      totalOrders: 342,
      totalCustomers: 156,
      totalProducts: 89,
      revenueGrowth: 12.5,
      ordersGrowth: 8.3,
      customersGrowth: 15.2,
      productsGrowth: 5.1
    };
  }

  private getMockOrdersAnalytics(): OrdersAnalytics {
    return {
      totalOrders: 342,
      pendingOrders: 23,
      completedOrders: 289,
      cancelledOrders: 30,
      ordersByMonth: this.getMockMonthlyData('orders'),
      ordersByStatus: this.getMockStatusData(),
      recentOrders: this.getMockRecentOrders()
    };
  }

  private getMockRevenueAnalytics(): RevenueAnalytics {
    return {
      totalRevenue: 1250000,
      monthlyRevenue: this.getMockMonthlyData('revenue'),
      revenueByCategory: this.getMockCategoryData(),
      averageOrderValue: 3654,
      revenueGrowth: 12.5
    };
  }

  private getMockProductAnalytics(): ProductAnalytics {
    return {
      totalProducts: 89,
      lowStockProducts: this.getMockLowStockProducts(),
      topSellingProducts: this.getMockTopProducts(),
      categoryDistribution: this.getMockCategoryData(),
      productsByStatus: this.getMockProductStatusData()
    };
  }

  private getMockCustomerAnalytics(): CustomerAnalytics {
    return {
      totalCustomers: 156,
      newCustomersThisMonth: 24,
      customerGrowth: 15.2,
      customersByMonth: this.getMockMonthlyData('customers'),
      topCustomers: this.getMockTopCustomers()
    };
  }

  private getMockMonthlyData(_type: string): MonthlyData[] {
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return months.slice(-6).map((month) => ({
      month,
      value: Math.floor(Math.random() * 1000) + 500,
      label: month
    }));
  }

  private getMockStatusData() {
    return [
      { status: 'รอดำเนินการ', count: 23, color: '#f59e0b' },
      { status: 'กำลังจัดส่ง', count: 45, color: '#3b82f6' },
      { status: 'สำเร็จ', count: 289, color: '#10b981' },
      { status: 'ยกเลิก', count: 30, color: '#ef4444' }
    ];
  }

  private getMockCategoryData() {
    return [
      { category: 'เกมคอนโซล', value: 45, color: '#3b82f6' },
      { category: 'เกมพีซี', value: 32, color: '#10b981' },
      { category: 'อุปกรณ์เสริม', value: 28, color: '#f59e0b' },
      { category: 'คอนโซลเกม', value: 15, color: '#ef4444' }
    ];
  }

  private getMockProductStatusData() {
    return [
      { status: 'มีสินค้า', count: 67, color: '#10b981' },
      { status: 'สินค้าน้อย', count: 15, color: '#f59e0b' },
      { status: 'หมดสินค้า', count: 7, color: '#ef4444' }
    ];
  }

  private getMockRecentOrders(): RecentOrder[] {
    return [
      {
        id: '001',
        customerName: 'สมชาย ใจดี',
        amount: 15600,
        status: 'completed',
        date: '2024-01-15',
        items: 3
      },
      {
        id: '002',
        customerName: 'สมหญิง รักษ์ดี',
        amount: 8900,
        status: 'processing',
        date: '2024-01-15',
        items: 2
      },
      {
        id: '003',
        customerName: 'วิชัย สุขใส',
        amount: 23400,
        status: 'pending',
        date: '2024-01-14',
        items: 4
      },
      {
        id: '004',
        customerName: 'มานี ใจงาม',
        amount: 12800,
        status: 'completed',
        date: '2024-01-14',
        items: 2
      },
      {
        id: '005',
        customerName: 'บุญมี ดีใจ',
        amount: 6700,
        status: 'cancelled',
        date: '2024-01-13',
        items: 1
      }
    ];
  }

  private getMockLowStockProducts(): ProductStock[] {
    return [
      { id: 1, name: 'PlayStation 5 Controller', stock: 3, minStock: 10, status: 'low_stock' },
      { id: 2, name: 'Xbox Game Pass Ultimate', stock: 0, minStock: 5, status: 'out_of_stock' },
      { id: 3, name: 'Nintendo Switch Pro Controller', stock: 5, minStock: 15, status: 'low_stock' }
    ];
  }

  private getMockTopProducts(): TopProduct[] {
    return [
      { id: 1, name: 'Grand Theft Auto VI', sales: 145, revenue: 145000, image: '/images/gta6.jpg' },
      { id: 2, name: 'The Last of Us Part III', sales: 98, revenue: 98000, image: '/images/tlou3.jpg' },
      { id: 3, name: 'Cyberpunk 2078', sales: 76, revenue: 76000, image: '/images/cyberpunk.jpg' }
    ];
  }

  private getMockTopCustomers(): TopCustomer[] {
    return [
      {
        id: 'cust1',
        name: 'สมชาย ใจดี',
        email: 'somchai@example.com',
        totalOrders: 15,
        totalSpent: 45600,
        lastOrderDate: '2024-01-15'
      },
      {
        id: 'cust2',
        name: 'สมหญิง รักษ์ดี',
        email: 'somying@example.com',
        totalOrders: 12,
        totalSpent: 38900,
        lastOrderDate: '2024-01-14'
      }
    ];
  }
}

export const analyticsService = new AnalyticsService();