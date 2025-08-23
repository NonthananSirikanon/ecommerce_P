import { apiClient } from './api';
import type {
  ShippingAddress,
  ShippingAddressesResponse,
  SingleShippingAddressResponse,
  CreateShippingAddressRequest,
  CreateShippingAddressResponse,
  UpdateShippingAddressRequest,
  UpdateShippingAddressResponse,
  SetDefaultAddressResponse,
  DeleteShippingAddressResponse,
} from '../types/shippingAddress';

export class ShippingAddressService {
  /**
   * Get all shipping addresses for the authenticated user
   */
  static async getShippingAddresses(): Promise<ShippingAddressesResponse> {
    return apiClient.get<ShippingAddressesResponse>('/shipping-addresses');
  }

  /**
   * Get a single shipping address by ID
   */
  static async getShippingAddressById(id: string): Promise<ShippingAddress> {
    const response = await apiClient.get<SingleShippingAddressResponse>(`/shipping-addresses/${id}`);
    return response.address;
  }

  /**
   * Get the default shipping address
   */
  static async getDefaultShippingAddress(): Promise<ShippingAddress> {
    const response = await apiClient.get<SingleShippingAddressResponse>('/shipping-addresses/default/address');
    return response.address;
  }

  /**
   * Create a new shipping address
   */
  static async createShippingAddress(addressData: CreateShippingAddressRequest): Promise<ShippingAddress> {
    const response = await apiClient.post<CreateShippingAddressResponse>('/shipping-addresses', addressData);
    return response.address;
  }

  /**
   * Update an existing shipping address
   */
  static async updateShippingAddress(
    id: string,
    addressData: UpdateShippingAddressRequest
  ): Promise<ShippingAddress> {
    const response = await apiClient.put<UpdateShippingAddressResponse>(`/shipping-addresses/${id}`, addressData);
    return response.address;
  }

  /**
   * Set a shipping address as default
   */
  static async setAddressAsDefault(id: string): Promise<void> {
    await apiClient.put<SetDefaultAddressResponse>(`/shipping-addresses/${id}/set-default`);
  }

  /**
   * Delete a shipping address
   */
  static async deleteShippingAddress(id: string): Promise<void> {
    await apiClient.delete<DeleteShippingAddressResponse>(`/shipping-addresses/${id}`);
  }

  /**
   * Format address for display
   */
  static formatAddress(address: ShippingAddress): string {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter(Boolean);

    return parts.join(', ');
  }

  /**
   * Format address for multiple lines
   */
  static formatAddressMultiline(address: ShippingAddress): string[] {
    const lines: string[] = [];
    
    // Full name
    const fullName = `${address.firstName} ${address.lastName}`;
    lines.push(fullName);
    
    // Company (if exists)
    if (address.company) {
      lines.push(address.company);
    }
    
    // Address line 1
    lines.push(address.addressLine1);
    
    // Address line 2 (if exists)
    if (address.addressLine2) {
      lines.push(address.addressLine2);
    }
    
    // City, State, Postal Code
    lines.push(`${address.city}, ${address.state} ${address.postalCode}`);
    
    // Country
    lines.push(address.country);
    
    // Phone (if exists)
    if (address.phone) {
      lines.push(address.phone);
    }
    
    return lines;
  }

  /**
   * Get address type label in Thai
   */
  static getAddressTypeLabel(type: 'home' | 'work' | 'other'): string {
    const labels = {
      home: 'บ้าน',
      work: 'ที่ทำงาน',
      other: 'อื่นๆ',
    };
    return labels[type];
  }

  /**
   * Validate shipping address data
   */
  static validateAddress(address: CreateShippingAddressRequest | UpdateShippingAddressRequest): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (address.firstName && address.firstName.length > 50) {
      errors.firstName = 'ชื่อต้องไม่เกิน 50 ตัวอักษร';
    }

    if (address.lastName && address.lastName.length > 50) {
      errors.lastName = 'นามสกุลต้องไม่เกิน 50 ตัวอักษร';
    }

    if (address.company && address.company.length > 100) {
      errors.company = 'ชื่อบริษัทต้องไม่เกิน 100 ตัวอักษร';
    }

    if (address.addressLine1 && address.addressLine1.length > 255) {
      errors.addressLine1 = 'ที่อยู่บรรทัดที่ 1 ต้องไม่เกิน 255 ตัวอักษร';
    }

    if (address.addressLine2 && address.addressLine2.length > 255) {
      errors.addressLine2 = 'ที่อยู่บรรทัดที่ 2 ต้องไม่เกิน 255 ตัวอักษร';
    }

    if (address.city && address.city.length > 100) {
      errors.city = 'เมืองต้องไม่เกิน 100 ตัวอักษร';
    }

    if (address.state && address.state.length > 100) {
      errors.state = 'จังหวัดต้องไม่เกิน 100 ตัวอักษร';
    }

    if (address.postalCode && address.postalCode.length > 20) {
      errors.postalCode = 'รหัสไปรษณีย์ต้องไม่เกิน 20 ตัวอักษร';
    }

    if (address.country && address.country.length > 100) {
      errors.country = 'ประเทศต้องไม่เกิน 100 ตัวอักษร';
    }

    if (address.phone && address.phone.length > 20) {
      errors.phone = 'เบอร์โทรศัพท์ต้องไม่เกิน 20 ตัวอักษร';
    }

    if (address.nickname && address.nickname.length > 50) {
      errors.nickname = 'ชื่อเล่นต้องไม่เกิน 50 ตัวอักษร';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}