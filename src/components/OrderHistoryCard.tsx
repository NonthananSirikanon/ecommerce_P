import React from 'react';
import { Package, Calendar, CreditCard, Truck, MapPin } from 'lucide-react';
import type { OrderHistory } from '../types/orderHistory';
import { OrderHistoryService } from '../utils/orderHistoryService';

interface OrderHistoryCardProps {
  orderHistory: OrderHistory;
  onViewDetail?: (orderId: string) => void;
}

const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({
  orderHistory,
  onViewDetail
}) => {
  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail(orderHistory.id);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Package className="w-5 h-5 text-orange-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {orderHistory.orderNumber}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            {OrderHistoryService.formatDate(orderHistory.createdAt)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {OrderHistoryService.formatPrice(orderHistory.totalAmount)}
          </div>
          <div className="text-sm text-gray-500">
            {orderHistory.itemCount} รายการ
          </div>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          OrderHistoryService.getStatusColor(orderHistory.orderStatus)
        }`}>
          {getStatusIcon(orderHistory.orderStatus)}
          <span className="ml-1">
            {OrderHistoryService.getOrderStatusText(orderHistory.orderStatus)}
          </span>
        </div>
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          OrderHistoryService.getStatusColor(orderHistory.paymentStatus)
        }`}>
          <CreditCard className="w-4 h-4 mr-1" />
          {OrderHistoryService.getPaymentStatusText(orderHistory.paymentStatus)}
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">รายการสินค้า</h4>
        <div className="space-y-2">
          {orderHistory.orderItems.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.productName} x {item.quantity}
              </span>
              <span className="text-gray-900 font-medium">
                {OrderHistoryService.formatPrice(item.totalPrice)}
              </span>
            </div>
          ))}
          {orderHistory.orderItems.length > 2 && (
            <div className="text-sm text-gray-500">
              และอีก {orderHistory.orderItems.length - 2} รายการ
            </div>
          )}
        </div>
      </div>

      {/* Shipping Information */}
      {orderHistory.shippingAddress && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                {orderHistory.shippingAddress.firstName} {orderHistory.shippingAddress.lastName}
              </div>
              <div className="text-gray-600">
                {orderHistory.shippingAddress.address}, {orderHistory.shippingAddress.city} {orderHistory.shippingAddress.postalCode}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Information */}
      {orderHistory.trackingNumber && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center">
            <Truck className="w-4 h-4 text-blue-600 mr-2" />
            <div>
              <div className="text-sm font-medium text-blue-900">
                หมายเลขติดตาม: {orderHistory.trackingNumber}
              </div>
              {orderHistory.shippingProvider && (
                <div className="text-sm text-blue-700">
                  ผู้ให้บริการ: {orderHistory.shippingProvider}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Information */}
      <div className="mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">วิธีการชำระเงิน:</span>
          <span className="text-gray-900">
            {OrderHistoryService.getPaymentMethodText(orderHistory.paymentMethod)}
          </span>
        </div>
        {orderHistory.paymentDate && (
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">วันที่ชำระเงิน:</span>
            <span className="text-gray-900">
              {OrderHistoryService.formatDate(orderHistory.paymentDate)}
            </span>
          </div>
        )}
      </div>

      {/* Important Dates */}
      <div className="space-y-1 mb-4">
        {orderHistory.shippedDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">วันที่จัดส่ง:</span>
            <span className="text-gray-900">
              {OrderHistoryService.formatDate(orderHistory.shippedDate)}
            </span>
          </div>
        )}
        {orderHistory.deliveredDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">วันที่ส่งถึง:</span>
            <span className="text-gray-900">
              {OrderHistoryService.formatDate(orderHistory.deliveredDate)}
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      {orderHistory.notes && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-md">
          <div className="text-sm">
            <div className="font-medium text-yellow-800 mb-1">หมายเหตุ:</div>
            <div className="text-yellow-700">{orderHistory.notes}</div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {onViewDetail && (
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleViewDetail}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            ดูรายละเอียด
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryCard;