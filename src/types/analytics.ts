export interface DashboardOverview {
  totalSales: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  totalOrders: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  totalUsers: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  newUsers: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  avgOrderValue: {
    value: number;
    change: string;
    isPositive: boolean;
  };
  conversionRate: {
    value: number;
    change: string;
    isPositive: boolean;
  };
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  productsGrowth: number;
}

export interface OrdersAnalytics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  ordersByMonth: MonthlyData[];
  ordersByStatus: StatusData[];
  recentOrders: RecentOrder[];
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: MonthlyData[];
  revenueByCategory: CategoryData[];
  averageOrderValue: number;
  revenueGrowth: number;
}

export interface ProductAnalytics {
  totalProducts: number;
  lowStockProducts: ProductStock[];
  topSellingProducts: TopProduct[];
  categoryDistribution: CategoryData[];
  productsByStatus: StatusData[];
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  customerGrowth: number;
  customersByMonth: MonthlyData[];
  topCustomers: TopCustomer[];
}

export interface MonthlyData {
  month: string;
  value: number;
  label?: string;
}

export interface StatusData {
  status: string;
  count: number;
  color: string;
}

export interface CategoryData {
  category: string;
  value: number;
  color?: string;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  items?: number;
}

export interface ProductStock {
  id: number;
  name: string;
  stock: number;
  minStock: number;
  status: 'out_of_stock' | 'low_stock' | 'in_stock';
}

export interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  image?: string;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface AnalyticsTimeRange {
  start: string;
  end: string;
}

export interface AnalyticsQueryParams {
  timeRange?: AnalyticsTimeRange;
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate?: string;
  endDate?: string;
  category?: string;
  status?: string;
  limit?: number;
  threshold?: number;
}

export interface SalesAnalytics {
  period: string;
  data: Array<{
    date: string;
    sales: number;
    orders: number;
    avgOrderValue: number;
  }>;
  totalSales: number;
  totalOrders: number;
  growth: {
    sales: number;
    orders: number;
  };
}

export interface OrderStatusDistribution {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
}

export interface TopSellingProduct {
  id: number;
  name: string;
  image?: string;
  unitsSold: number;
  revenue: number;
  growth: number;
  category: string;
}

export interface InventoryAlert {
  id: number;
  name: string;
  currentStock: number;
  threshold: number;
  status: 'low' | 'out_of_stock' | 'critical';
  lastRestocked?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  date?: string;
}