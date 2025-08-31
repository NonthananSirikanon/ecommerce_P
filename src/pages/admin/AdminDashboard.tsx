import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package,
  DollarSign,
  Eye,
  Calendar,
  Filter
} from 'lucide-react';
import { useDashboardStats, useOrdersAnalytics, useRevenueAnalytics, useProductAnalytics } from '../../hooks/useAnalytics';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import DonutChart from '../../components/charts/DonutChart';

const AdminDashboard = () => {
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: ordersAnalytics, loading: ordersLoading } = useOrdersAnalytics();
  const { data: revenueAnalytics, loading: revenueLoading } = useRevenueAnalytics();
  const { data: productAnalytics, loading: productLoading } = useProductAnalytics();

  const loading = statsLoading || ordersLoading || revenueLoading || productLoading;

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    const statusText: { [key: string]: string } = {
      pending: 'รอดำเนินการ',
      processing: 'กำลังจัดส่ง',
      completed: 'สำเร็จ',
      cancelled: 'ยกเลิก'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusText[status] || status}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
        <p className="text-gray-600">ภาพรวมของร้านค้าออนไลน์</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ยอดขายรวม</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" />
                +{stats?.revenueGrowth || 0}% จากเดือนที่แล้ว
              </p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" />
                +{stats?.ordersGrowth || 0}% จากเดือนที่แล้ว
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ลูกค้าทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" />
                +{stats?.customersGrowth || 0}% จากเดือนที่แล้ว
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">สินค้าทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" />
                +{stats?.productsGrowth || 0}% จากเดือนที่แล้ว
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Package size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">ยอดขายรายเดือน</h2>
            <button className="text-gray-500 hover:text-gray-700">
              <Filter size={16} />
            </button>
          </div>
          {revenueAnalytics?.monthlyRevenue ? (
            <LineChart 
              data={revenueAnalytics.monthlyRevenue}
              height={250}
              color="#10b981"
              xAxisKey="month"
              dataKey="value"
              formatTooltip={(value) => [formatCurrency(Number(value)), 'ยอดขาย']}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">คำสั่งซื้อรายเดือน</h2>
            <button className="text-gray-500 hover:text-gray-700">
              <Calendar size={16} />
            </button>
          </div>
          {ordersAnalytics?.ordersByMonth ? (
            <BarChart 
              data={ordersAnalytics.ordersByMonth}
              height={250}
              color="#3b82f6"
              xAxisKey="month"
              dataKey="value"
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">สถานะคำสั่งซื้อ</h2>
          {ordersAnalytics?.ordersByStatus ? (
            <DonutChart 
              data={ordersAnalytics.ordersByStatus.map(item => ({
                label: item.status,
                value: item.count,
                color: item.color
              }))}
              height={250}
              centerText={ordersAnalytics.totalOrders.toString()}
              centerSubtext="คำสั่งซื้อทั้งหมด"
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">หมวดหมู่สินค้า</h2>
          {productAnalytics?.categoryDistribution ? (
            <PieChart 
              data={productAnalytics.categoryDistribution.map(item => ({
                label: item.category,
                value: item.value,
                color: item.color
              }))}
              height={250}
              showLabels={true}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">คำสั่งซื้อล่าสุด</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              <Eye size={16} className="mr-1" />
              ดูทั้งหมด
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ID คำสั่งซื้อ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ลูกค้า</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ยอดเงิน</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">สถานะ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {ordersAnalytics?.recentOrders?.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm">#{order.id.padStart(6, '0')}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      {order.items && (
                        <div className="text-xs text-gray-500">{order.items} รายการ</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{formatCurrency(order.amount)}</span>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(order.date).toLocaleDateString('th-TH')}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2">กำลังโหลดข้อมูล...</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">การดำเนินการด่วน</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Package className="mx-auto mb-2 text-gray-400" size={24} />
            <span className="block text-sm font-medium text-gray-700">เพิ่มสินค้าใหม่</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <ShoppingCart className="mx-auto mb-2 text-gray-400" size={24} />
            <span className="block text-sm font-medium text-gray-700">จัดการคำสั่งซื้อ</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Users className="mx-auto mb-2 text-gray-400" size={24} />
            <span className="block text-sm font-medium text-gray-700">จัดการลูกค้า</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <TrendingUp className="mx-auto mb-2 text-gray-400" size={24} />
            <span className="block text-sm font-medium text-gray-700">ดูรายงาน</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;