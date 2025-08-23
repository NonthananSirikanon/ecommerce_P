export interface ShippingAddress {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  addressType: 'home' | 'work' | 'other';
  nickname?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShippingAddressRequest {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  phone?: string;
  addressType?: 'home' | 'work' | 'other';
  nickname?: string;
  isDefault?: boolean;
}

export interface UpdateShippingAddressRequest {
  firstName?: string;
  lastName?: string;
  company?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  addressType?: 'home' | 'work' | 'other';
  nickname?: string;
  isDefault?: boolean;
}

export interface ShippingAddressesResponse {
  success: boolean;
  addresses: ShippingAddress[];
  count: number;
}

export interface SingleShippingAddressResponse {
  success: boolean;
  address: ShippingAddress;
}

export interface CreateShippingAddressResponse {
  success: boolean;
  message: string;
  address: ShippingAddress;
}

export interface UpdateShippingAddressResponse {
  success: boolean;
  message: string;
  address: ShippingAddress;
}

export interface SetDefaultAddressResponse {
  success: boolean;
  message: string;
  address: {
    id: string;
    isDefault: boolean;
    updatedAt: string;
  };
}

export interface DeleteShippingAddressResponse {
  success: boolean;
  message: string;
}