import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, DollarSign, Filter, Eye, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { PaymentService } from '../utils/paymentService';
import type { Payment, PaymentStatus } from '../types/payment';
import SweetAlertUtils from '../utils/sweetAlert';

const PaymentManagementPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | ''>('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const filterPayments = React.useCallback(() => {
    if (!selectedStatus) {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(payments.filter(payment => payment.paymentStatus === selectedStatus));
    }
  }, [payments, selectedStatus]);

  useEffect(() => {
    filterPayments();
  }, [filterPayments]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await PaymentService.getPayments();
      setPayments(response.payments);
    } catch (error) {
      console.error('Error loading payments:', error);
      await SweetAlertUtils.error(
        'เกิดข้อผิดพลาด!',
        'ไม่สามารถโหลดข้อมูลการชำระเงินได้'
      );
      // Fallback: ใช้ข้อมูลจำลองเมื่อ API ไม่พร้อม
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };


  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      case 'refunded':
        return <DollarSign className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    const colors = PaymentService.getPaymentStatusColor(status);
    return `${colors.bg} ${colors.text}`;
  };

  const handleViewDetail = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const formatAmount = (amount: string | number) => {
    return PaymentService.formatAmount(amount);
  };

  const formatDate = (dateString: string | null) => {
    return PaymentService.formatDate(dateString);
  };

  const getPaymentMethodLabel = (method: string) => {
    return PaymentService.getPaymentMethodLabel(method as 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'digital_wallet');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลการชำระเงิน...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ประวัติการชำระเงิน</h1>
          <p className="text-gray-600">ดูและจัดการประวัติการชำระเงินทั้งหมด</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {payments.length}
                </div>
                <div className="text-sm text-gray-600">รายการทั้งหมด</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.paymentStatus === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">ชำระสำเร็จ</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => ['pending', 'processing'].includes(p.paymentStatus)).length}
                </div>
                <div className="text-sm text-gray-600">รอดำเนินการ</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {formatAmount(
                    payments
                      .filter(p => p.paymentStatus === 'completed')
                      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                  )}
                </div>
                <div className="text-sm text-gray-600">ยอดรวมที่ชำระ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as PaymentStatus | '')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">สถานะทั้งหมด</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="processing">กำลังประมวลผล</option>
              <option value="completed">ชำระสำเร็จ</option>
              <option value="failed">ชำระไม่สำเร็จ</option>
              <option value="cancelled">ยกเลิกแล้ว</option>
              <option value="refunded">คืนเงินแล้ว</option>
            </select>
          </div>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedStatus ? 'ไม่พบข้อมูลการชำระเงินในสถานะนี้' : 'ยังไม่มีประวัติการชำระเงิน'}
            </h3>
            <p className="text-gray-600">
              {selectedStatus 
                ? 'ลองเปลี่ยนตัวกรองหรือตรวจสอบสถานะอื่น' 
                : 'เมื่อคุณทำการสั่งซื้อสินค้า ประวัติการชำระเงินจะแสดงที่นี่'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รหัสการชำระเงิน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รหัสคำสั่งซื้อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จำนวนเงิน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วิธีการชำระ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การดำเนินการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {payment.id.substring(0, 8).toUpperCase()}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {payment.orderId.substring(0, 8).toUpperCase()}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatAmount(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getPaymentMethodLabel(payment.paymentMethod)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(payment.paymentStatus)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                            {PaymentService.getPaymentStatusLabel(payment.paymentStatus)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(payment.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(payment)}
                          className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Detail Modal */}
        {showDetailModal && selectedPayment && (
          <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">รายละเอียดการชำระเงิน</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลการชำระเงิน</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">รหัสการชำระเงิน</label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{selectedPayment.id}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">รหัสคำสั่งซื้อ</label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{selectedPayment.orderId}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">จำนวนเงิน</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {formatAmount(selectedPayment.amount)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">สกุลเงิน</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedPayment.currency}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">วิธีการชำระ</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {getPaymentMethodLabel(selectedPayment.paymentMethod)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">สถานะ</label>
                        <div className="mt-1 flex items-center">
                          {getStatusIcon(selectedPayment.paymentStatus)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayment.paymentStatus)}`}>
                            {PaymentService.getPaymentStatusLabel(selectedPayment.paymentStatus)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">รายละเอียดธุรกรรม</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">รหัสธุรกรรม</label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">
                          {selectedPayment.transactionId || '-'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ผู้ให้บริการ</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedPayment.paymentProvider || '-'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">วันที่สร้าง</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(selectedPayment.createdAt)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">วันที่ชำระเงิน</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(selectedPayment.paidAt || null)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">อัปเดตล่าสุด</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(selectedPayment.updatedAt)}
                        </p>
                      </div>
                      
                      {selectedPayment.failureReason && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">สาเหตุที่ล้มเหลว</label>
                          <p className="mt-1 text-sm text-red-600">
                            {selectedPayment.failureReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                
              </div>

              <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagementPage;