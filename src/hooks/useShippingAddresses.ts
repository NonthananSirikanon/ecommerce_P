import { useState, useEffect, useCallback } from 'react';
import { ShippingAddressService } from '../utils/shippingAddressService';
import type {
  ShippingAddress,
  CreateShippingAddressRequest,
  UpdateShippingAddressRequest,
} from '../types/shippingAddress';

interface UseShippingAddressesState {
  addresses: ShippingAddress[];
  defaultAddress: ShippingAddress | null;
  loading: boolean;
  error: string | null;
}

interface UseShippingAddressesResult extends UseShippingAddressesState {
  refetch: () => Promise<void>;
  createAddress: (addressData: CreateShippingAddressRequest) => Promise<ShippingAddress>;
  updateAddress: (id: string, addressData: UpdateShippingAddressRequest) => Promise<ShippingAddress>;
  deleteAddress: (id: string) => Promise<void>;
  setAsDefault: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useShippingAddresses = (): UseShippingAddressesResult => {
  const [state, setState] = useState<UseShippingAddressesState>({
    addresses: [],
    defaultAddress: null,
    loading: true,
    error: null,
  });

  const fetchAddresses = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const [addressesResponse, defaultAddress] = await Promise.allSettled([
        ShippingAddressService.getShippingAddresses(),
        ShippingAddressService.getDefaultShippingAddress().catch(() => null),
      ]);

      let addresses: ShippingAddress[] = [];
      let defaultAddr: ShippingAddress | null = null;

      if (addressesResponse.status === 'fulfilled') {
        addresses = addressesResponse.value.addresses;
      }

      if (defaultAddress.status === 'fulfilled' && defaultAddress.value) {
        defaultAddr = defaultAddress.value;
      }

      setState(prev => ({
        ...prev,
        addresses,
        defaultAddress: defaultAddr,
        loading: false,
      }));
    } catch (err) {
      console.error('Error fetching shipping addresses:', err);
      let errorMessage = 'เกิดข้อผิดพลาดในการโหลดที่อยู่จัดส่ง';

      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('403')) {
          errorMessage = 'กรุณาเข้าสู่ระบบเพื่อดูที่อยู่จัดส่ง';
        } else {
          errorMessage = err.message;
        }
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    }
  }, []);

  const createAddress = useCallback(async (addressData: CreateShippingAddressRequest): Promise<ShippingAddress> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const newAddress = await ShippingAddressService.createShippingAddress(addressData);

      setState(prev => ({
        ...prev,
        addresses: [...prev.addresses, newAddress],
        defaultAddress: newAddress.isDefault ? newAddress : prev.defaultAddress,
      }));

      return newAddress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างที่อยู่';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const updateAddress = useCallback(async (
    id: string,
    addressData: UpdateShippingAddressRequest
  ): Promise<ShippingAddress> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const updatedAddress = await ShippingAddressService.updateShippingAddress(id, addressData);

      setState(prev => ({
        ...prev,
        addresses: prev.addresses.map(addr =>
          addr.id === id ? updatedAddress : addr
        ),
        defaultAddress: updatedAddress.isDefault ? updatedAddress : 
          (prev.defaultAddress?.id === id ? null : prev.defaultAddress),
      }));

      return updatedAddress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตที่อยู่';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const deleteAddress = useCallback(async (id: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await ShippingAddressService.deleteShippingAddress(id);

      setState(prev => ({
        ...prev,
        addresses: prev.addresses.filter(addr => addr.id !== id),
        defaultAddress: prev.defaultAddress?.id === id ? null : prev.defaultAddress,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบที่อยู่';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const setAsDefault = useCallback(async (id: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await ShippingAddressService.setAddressAsDefault(id);

      setState(prev => ({
        ...prev,
        addresses: prev.addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id,
        })),
        defaultAddress: prev.addresses.find(addr => addr.id === id) || prev.defaultAddress,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการตั้งเป็นที่อยู่หลัก';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    ...state,
    refetch: fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setAsDefault,
    clearError,
  };
};

/**
 * Hook for managing a single shipping address
 */
export const useShippingAddress = (addressId: string) => {
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = useCallback(async () => {
    if (!addressId) return;

    try {
      setLoading(true);
      setError(null);
      const addressData = await ShippingAddressService.getShippingAddressById(addressId);
      setAddress(addressData);
    } catch (err) {
      console.error('Error fetching shipping address:', err);
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดที่อยู่';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [addressId]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  return {
    address,
    loading,
    error,
    refetch: fetchAddress,
  };
};