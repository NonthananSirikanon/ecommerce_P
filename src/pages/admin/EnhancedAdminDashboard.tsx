import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  ShoppingCart, 
  Package,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Eye
} from 'lucide-react';
import { 
  useDashboardOverview, 
  useSalesAnalytics, 
  useOrderStatusDistribution, 
  useTopSellingProducts, 
  useInventoryAlerts 
} from '../../hooks/useAnalytics';
import LineChart from '../../components/charts/LineChart';
import DonutChart from '../../components/charts/DonutChart';
import { analyticsService } from '../../utils/analyticsService';

const EnhancedAdminDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    period: 'daily' as const
  });
  const [refreshing, setRefreshing] = useState(false);

  const { data: overview, loading: overviewLoading, refetch: refetchOverview } = useDashboardOverview();
  const { data: salesData, loading: salesLoading } = useSalesAnalytics(dateRange);
  const { data: orderStatus, loading: orderStatusLoading } = useOrderStatusDistribution();
  const { data: topProducts, loading: topProductsLoading } = useTopSellingProducts(5);
  const { data: inventoryAlerts, loading: inventoryLoading } = useInventoryAlerts(10);

  const loading = overviewLoading || salesLoading || orderStatusLoading || topProductsLoading || inventoryLoading;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      await analyticsService.refreshAnalytics();
      await refetchOverview();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: '#f59e0b',
      processing: '#3b82f6', 
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444',
      returned: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getInventoryStatusColor = (status: string) => {
    const colors = {
      low: 'text-yellow-600 bg-yellow-100',
      out_of_stock: 'text-red-600 bg-red-100',
      critical: 'text-red-600 bg-red-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ดผู้ดูแลระบบ</h1>
          <p className="text-gray-600">ภาพรวมและการวิเคราะห์ข้อมูลร้านค้าออนไลน์</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={dateRange.period}
            onChange={(e) => setDateRange({ ...dateRange, period: e.target.value as 'daily' | 'weekly' | 'monthly' })}
          >
            <option value="daily">รายวัน</option>
            <option value="weekly">รายสัปดาห์</option>
            <option value="monthly">รายเดือน</option>
          </select>
          <button
            onClick={handleRefreshData}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>รีเฟรช</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ยอดขายรวม</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(overview?.totalSales.value || 0)}</p>
              <div className={`text-sm flex items-center mt-1 ${
                overview?.totalSales.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {overview?.totalSales.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {overview?.totalSales.change}%
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">คำสั่งซื้อ</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.totalOrders.value || 0}</p>
              <div className={`text-sm flex items-center mt-1 ${
                overview?.totalOrders.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {overview?.totalOrders.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {overview?.totalOrders.change}%
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ผู้ใช้ทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.totalUsers.value || 0}</p>
              <div className={`text-sm flex items-center mt-1 ${
                overview?.totalUsers.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {overview?.totalUsers.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {overview?.totalUsers.change}%
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ผู้ใช้ใหม่</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.newUsers.value || 0}</p>
              <div className={`text-sm flex items-center mt-1 ${
                overview?.newUsers.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {overview?.newUsers.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {overview?.newUsers.change}%
              </div>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users size={24} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ค่าเฉลี่ย/คำสั่งซื้อ</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(overview?.avgOrderValue.value || 0)}</p>
              <div className={`text-sm flex items-center mt-1 ${
                overview?.avgOrderValue.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {overview?.avgOrderValue.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {overview?.avgOrderValue.change}%
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">อัตราการแปลง</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(overview?.conversionRate.value || 0)}</p>
              <div className={`text-sm flex items-center mt-1 ${
                overview?.conversionRate.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {overview?.conversionRate.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {overview?.conversionRate.change}%
              </div>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <TrendingUp size={24} className="text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">ยอดขายรายวัน</h2>
            <button className="text-gray-500 hover:text-gray-700">
              <Calendar size={16} />
            </button>
          </div>
          {salesData?.data ? (
            <LineChart 
              data={salesData.data.map(item => ({
                label: new Date(item.date).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' }),
                value: item.sales
              }))}
              height={250}
              color="#10b981"
              xAxisKey="label"
              dataKey="value"
              formatTooltip={(value) => [formatCurrency(Number(value)), 'ยอดขาย']}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">สถานะคำสั่งซื้อ</h2>
          {orderStatus ? (
            <DonutChart 
              data={Object.entries(orderStatus).map(([status, count]) => ({
                label: {
                  pending: 'รอดำเนินการ',
                  processing: 'กำลังประมวลผล',
                  shipped: 'จัดส่งแล้ว',
                  delivered: 'จัดส่งสำเร็จ',
                  cancelled: 'ยกเลิก',
                  returned: 'คืนสินค้า'
                }[status] || status,
                value: count,
                color: getStatusColor(status)
              }))}
              height={250}
              centerText={Object.values(orderStatus).reduce((a, b) => a + b, 0).toString()}
              centerSubtext="คำสั่งซื้อทั้งหมด"
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">สินค้าขายดี</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              <Eye size={16} className="mr-1" />
              ดูทั้งหมด
            </button>
          </div>
          <div className="space-y-4">
            {Array.isArray(topProducts) && topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.unitsSold} ชิ้น</p>
                    <p className="text-xs text-gray-500">{formatCurrency(product.revenue)}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    product.growth > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                  }`}>
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </div>
                </div>
              ))
            ) : topProductsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <p>ไม่มีข้อมูลสินค้าขายดี</p>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">แจ้งเตือนคลังสินค้า</h2>
            <AlertTriangle size={20} className="text-yellow-500" />
          </div>
          <div className="space-y-4">
            {Array.isArray(inventoryAlerts) && inventoryAlerts.length > 0 ? (
              inventoryAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.name}</p>
                    <p className="text-xs text-gray-500">
                      คลังคงเหลือ: {alert.currentStock} / ขั้นต่ำ: {alert.threshold}
                    </p>
                    {alert.lastRestocked && (
                      <p className="text-xs text-gray-400">
                        เติมล่าสุด: {new Date(alert.lastRestocked).toLocaleDateString('th-TH')}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getInventoryStatusColor(alert.status)}`}>
                    {alert.status === 'low' && 'สต็อกน้อย'}
                    {alert.status === 'out_of_stock' && 'หมดสต็อก'}
                    {alert.status === 'critical' && 'วิกฤต'}
                  </span>
                </div>
              ))
            ) : inventoryLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <p>ไม่มีการแจ้งเตือนคลังสินค้า</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;