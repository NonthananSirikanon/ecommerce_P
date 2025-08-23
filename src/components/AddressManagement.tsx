import React, { useState } from 'react';
import { Plus, MapPin, Edit, Trash2, Star } from 'lucide-react';
import { useShippingAddresses } from '../hooks/useShippingAddresses';
import { ShippingAddressService } from '../utils/shippingAddressService';
import type { ShippingAddress, CreateShippingAddressRequest, UpdateShippingAddressRequest } from '../types/shippingAddress';
import SweetAlertUtils from '../utils/sweetAlert';

interface AddressManagementProps {
  selectedAddressId?: string | null;
  onAddressSelect?: (address: ShippingAddress) => void;
}

interface AddressFormData {
  firstName: string;
  lastName: string;
  company: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  addressType: 'home' | 'work' | 'other';
  nickname: string;
  isDefault: boolean;
}

const AddressManagement: React.FC<AddressManagementProps> = ({
  selectedAddressId,
  onAddressSelect,
}) => {
  const {
    addresses,
    loading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setAsDefault,
    clearError,
  } = useShippingAddresses();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    firstName: '',
    lastName: '',
    company: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'ประเทศไทย',
    phone: '',
    addressType: 'home',
    nickname: '',
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'ประเทศไทย',
      phone: '',
      addressType: 'home',
      nickname: '',
      isDefault: false,
    });
    setFormErrors({});
    setEditingAddress(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (address: ShippingAddress) => {
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || '',
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || '',
      addressType: address.addressType,
      nickname: address.nickname || '',
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
    setFormErrors({});
    setShowForm(true);
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'กรุณากรอกชื่อ';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'กรุณากรอกนามสกุล';
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = 'กรุณากรอกที่อยู่';
    }

    if (!formData.city.trim()) {
      errors.city = 'กรุณากรอกเมือง';
    }

    if (!formData.state.trim()) {
      errors.state = 'กรุณากรอกจังหวัด';
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = 'กรุณากรอกรหัสไปรษณีย์';
    }

    if (!formData.country.trim()) {
      errors.country = 'กรุณากรอกประเทศ';
    }

    // Additional validation using the service
    const serviceValidation = ShippingAddressService.validateAddress(formData);
    Object.assign(errors, serviceValidation.errors);

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      if (editingAddress) {
        // Update existing address
        const updateData: UpdateShippingAddressRequest = { ...formData };
        await updateAddress(editingAddress.id, updateData);
        SweetAlertUtils.success('สำเร็จ!', 'อัปเดตที่อยู่เรียบร้อยแล้ว');
      } else {
        // Create new address  
        const createData: CreateShippingAddressRequest = { ...formData };
        await createAddress(createData);
        SweetAlertUtils.success('สำเร็จ!', 'เพิ่มที่อยู่ใหม่เรียบร้อยแล้ว');
      }
      
      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
      SweetAlertUtils.error('เกิดข้อผิดพลาด!', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (address: ShippingAddress) => {
    const result = await SweetAlertUtils.confirm(
      'ลบที่อยู่?',
      `คุณต้องการลบที่อยู่ "${address.nickname || address.addressLine1}" หรือไม่?`,
      'warning'
    );

    if (result.isConfirmed) {
      try {
        await deleteAddress(address.id);
        SweetAlertUtils.toast('success', 'ลบที่อยู่เรียบร้อยแล้ว');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบที่อยู่';
        SweetAlertUtils.error('เกิดข้อผิดพลาด!', errorMessage);
      }
    }
  };

  const handleSetDefault = async (address: ShippingAddress) => {
    try {
      await setAsDefault(address.id);
      SweetAlertUtils.toast('success', 'ตั้งเป็นที่อยู่หลักเรียบร้อยแล้ว');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการตั้งที่อยู่หลัก';
      SweetAlertUtils.error('เกิดข้อผิดพลาด!', errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">กำลังโหลดที่อยู่...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">ที่อยู่จัดส่ง</h3>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          เพิ่มที่อยู่
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm">{error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 underline text-sm mt-1"
          >
            ปิด
          </button>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">คุณยังไม่มีที่อยู่จัดส่ง</p>
          <button
            onClick={openAddForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            เพิ่มที่อยู่แรก
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 transition-colors ${
                selectedAddressId === address.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="flex-grow cursor-pointer"
                  onClick={() => onAddressSelect?.(address)}
                >
                  <div className="flex items-center mb-2">
                    {address.nickname && (
                      <span className="font-medium text-gray-900 mr-2">
                        {address.nickname}
                      </span>
                    )}
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {ShippingAddressService.getAddressTypeLabel(address.addressType)}
                    </span>
                    {address.isDefault && (
                      <span className="ml-2 flex items-center text-sm text-yellow-600">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        หลัก
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    {ShippingAddressService.formatAddressMultiline(address).map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address)}
                      className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                      title="ตั้งเป็นที่อยู่หลัก"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => openEditForm(address)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="แก้ไข"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(address)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="ลบ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingAddress ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อ *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="กรอกชื่อ"
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    นามสกุล *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="กรอกนามสกุล"
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Company and Nickname */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    บริษัท (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ชื่อบริษัท"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อเล่น (เช่น บ้าน, ที่ทำงาน)
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ชื่อเล่นของที่อยู่"
                  />
                </div>
              </div>

              {/* Address Lines */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ที่อยู่ บรรทัดที่ 1 *
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="เลขที่ ซอย ถนน"
                />
                {formErrors.addressLine1 && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.addressLine1}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ที่อยู่ บรรทัดที่ 2 (ถ้ามี)
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="อาคาร ชั้น ห้อง"
                />
              </div>

              {/* City, State, Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เมือง *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="เมือง"
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    จังหวัด *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="จังหวัด"
                  />
                  {formErrors.state && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสไปรษณีย์ *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10100"
                  />
                  {formErrors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>
                  )}
                </div>
              </div>

              {/* Country and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ประเทศ *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ประเทศไทย"
                  />
                  {formErrors.country && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="08x-xxx-xxxx"
                  />
                </div>
              </div>

              {/* Address Type and Default */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ประเภทที่อยู่
                  </label>
                  <select
                    value={formData.addressType}
                    onChange={(e) => handleInputChange('addressType', e.target.value as 'home' | 'work' | 'other')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="home">บ้าน</option>
                    <option value="work">ที่ทำงาน</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                    ตั้งเป็นที่อยู่หลัก
                  </label>
                </div>
              </div>
            </form>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังบันทึก...' : editingAddress ? 'อัปเดต' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManagement;