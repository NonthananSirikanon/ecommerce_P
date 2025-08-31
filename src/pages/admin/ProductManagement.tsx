import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Filter,
  Package,
  Upload,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AdminProductService, type ProductQueryParams, type CreateProductRequest, type UpdateProductRequest } from '../../utils/adminProductService';
import type { Product } from '../../types/product';

interface ProductFormData {
  name: string;
  description: string;
  price: string; // เปลี่ยนเป็น string เพื่อให้สามารถว่างได้
  quantity: string; // เปลี่ยนเป็น string เพื่อให้สามารถว่างได้
  images: File[];
  imageUrls: string[];
}

interface PaginationState {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    limit: 20,
    totalProducts: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '', // เริ่มด้วยค่าว่าง
    quantity: '', // เริ่มด้วยค่าว่าง
    images: [],
    imageUrls: []
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock categories - replace with real category API call
  const categories = [
    { id: '1', name: 'เกมคอนโซล' },
    { id: '2', name: 'เกมพีซี' },
    { id: '3', name: 'อุปกรณ์เสริม' },
    { id: '4', name: 'คอนโซลเกม' }
  ];

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ProductQueryParams = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: searchTerm.trim() || undefined,
        categoryId: selectedCategory || undefined,
        status: 'all' // Show all products (active and inactive)
      };
      
      const response = await AdminProductService.getProducts(params);
      
      console.log('API Response:', response); // Debug log
      
      // New API format doesn't have success field, if we get products array it's successful
      if (response.products && Array.isArray(response.products)) {
        console.log('Products:', response.products); // Debug log
        console.log('Pagination:', response.pagination); // Debug log
        
        setProducts(response.products);
        setPagination({
          currentPage: response.pagination?.currentPage || 1,
          limit: pagination.limit, // Keep current limit
          totalProducts: response.pagination?.totalProducts || 0,
          totalPages: response.pagination?.totalPages || 0,
          hasNextPage: response.pagination?.hasNextPage || false,
          hasPrevPage: response.pagination?.hasPrevPage || false
        });
        setError(null); // Clear any previous errors
      } else {
        console.error('API Error:', response); // Debug log
        
        // Fallback: check if we have products array in any format
        if (response && typeof response === 'object' && 'products' in response && Array.isArray(response.products)) {
          const fallbackResponse = response as { products: Product[] };
          console.log('Using fallback products data, products length:', fallbackResponse.products.length);
          setProducts(fallbackResponse.products);
          setPagination({
            currentPage: 1,
            limit: pagination.limit,
            totalProducts: fallbackResponse.products.length,
            totalPages: Math.ceil((fallbackResponse.products.length || 1) / pagination.limit),
            hasNextPage: false,
            hasPrevPage: false
          });
          
          if (fallbackResponse.products.length === 0) {
            setError('API เชื่อมต่อได้แต่ไม่มีข้อมูลสินค้า - แสดงข้อมูลตัวอย่าง');
            
            // Add sample data for empty response
            const sampleProducts: Product[] = [
              {
                id: 1,
                name: 'PlayStation 5 (Sample)',
                description: 'เกมคอนโซลรุ่นใหม่ล่าสุด - ข้อมูลตัวอย่าง',
                price: 19990,
                stock: 0,
                categoryId: '1',
                images: ['https://via.placeholder.com/200x200?text=PS5+Sample'],
                sku: 'PS5-SAMPLE',
                brand: 'Sony'
              },
              {
                id: 2,
                name: 'Xbox Series X (Sample)',
                description: 'เกมคอนโซลประสิทธิภาพสูง - ข้อมูลตัวอย่าง',
                price: 17990,
                stock: 2,
                categoryId: '1',
                images: ['https://via.placeholder.com/200x200?text=Xbox+Sample'],
                sku: 'XBOX-SAMPLE',
                brand: 'Microsoft'
              }
            ];
            
            setProducts(sampleProducts);
            setPagination({
              currentPage: 1,
              limit: 20,
              totalProducts: sampleProducts.length,
              totalPages: 1,
              hasNextPage: false,
              hasPrevPage: false
            });
          } else {
            setError('API ตอบกลับแต่มี warning (success: false)');
          }
        } else {
          setError('ไม่สามารถโหลดข้อมูลสินค้าได้ - รูปแบบ response ไม่ถูกต้อง');
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // If API fails, show mock data for testing
      console.log('Using mock data due to API failure');
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'PlayStation 5',
          description: 'เกมคอนโซลรุ่นใหม่ล่าสุด',
          price: 19990,
          stock: 10,
          categoryId: '1',
          images: ['https://via.placeholder.com/200x200?text=PS5'],
          sku: 'PS5-001',
          brand: 'Sony'
        },
        {
          id: 2,
          name: 'Xbox Series X',
          description: 'เกมคอนโซลประสิทธิภาพสูง',
          price: 17990,
          stock: 5,
          categoryId: '1',
          images: ['https://via.placeholder.com/200x200?text=Xbox'],
          sku: 'XBOX-001',
          brand: 'Microsoft'
        }
      ];
      
      setProducts(mockProducts);
      setPagination({
        currentPage: 1,
        limit: 20,
        totalProducts: mockProducts.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      });
      setError('กำลังใช้ข้อมูลตัวอย่าง (API ไม่พร้อมใช้งาน)');
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount and when search/filter changes
  useEffect(() => {
    console.log('Search/filter effect triggered:', { searchTerm, selectedCategory });
    const timeoutId = setTimeout(() => {
      console.log('Debounced search triggered, resetting pagination');
      setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
      fetchProducts();
    }, 300); // Debounce search
    
    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory]);

  // Load products when page changes
  useEffect(() => {
    console.log('Pagination effect triggered:', { currentPage: pagination.currentPage, limit: pagination.limit });
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, pagination.limit]);

  // Initial load
  useEffect(() => {
    console.log('Component mounted, loading products...');
    
    // Test direct API call for debugging
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => console.log('Direct fetch test result:', data))
      .catch(err => console.error('Direct fetch test error:', err));
    
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    setFormErrors({});
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(), // แปลงเป็น string
        quantity: (product.inventory?.quantity || product.stock || 0).toString(), // แปลงเป็น string
        images: [],
        imageUrls: product.images || (product.image ? [product.image] : [])
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '', // ค่าว่าง
        quantity: '', // ค่าว่าง
        images: [],
        imageUrls: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormErrors({});
    setFormData({
      name: '',
      description: '',
      price: '', // ค่าว่าง
      quantity: '', // ค่าว่าง
      images: [],
      imageUrls: []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSaving(true);
    
    try {
      // Convert images to base64 if any
      const imageBase64Array: string[] = [];
      for (const file of formData.images) {
        const base64 = await AdminProductService.fileToBase64(file);
        imageBase64Array.push(base64);
      }
      
      if (editingProduct) {
        // Update product
        const updateData: UpdateProductRequest = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          inventory: {
            quantity: parseInt(formData.quantity) || 0
          }
        };
        
        // Add new images if uploaded
        if (imageBase64Array.length > 0) {
          updateData.images = [...formData.imageUrls, ...imageBase64Array];
        }
        
        await AdminProductService.updateProduct(editingProduct.id.toString(), updateData);
      } else {
        // Create product (simple version)
        const createData: CreateProductRequest = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          inventory: {
            quantity: parseInt(formData.quantity) || 0
          }
        };
        
        // Handle image - use single image field if only one image, otherwise use images array
        if (imageBase64Array.length === 1 && formData.imageUrls.length === 0) {
          createData.image = imageBase64Array[0];
        } else if ([...formData.imageUrls, ...imageBase64Array].length > 0) {
          createData.images = [...formData.imageUrls, ...imageBase64Array];
        }
        
        // Validate form data
        const validation = AdminProductService.validateCreateProduct(createData);
        if (!validation.isValid) {
          // Validation errors are already mapped correctly
          setFormErrors(validation.errors);
          setSaving(false);
          return;
        }
        
        await AdminProductService.createProduct(createData);
      }
      
      handleCloseModal();
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error saving product:', error);
      setFormErrors({ general: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('คุณต้องการลบสินค้านี้หรือไม่?')) {
      try {
        await AdminProductService.deleteProduct(productId.toString());
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('เกิดข้อผิดพลาดในการลบสินค้า');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { color: 'text-red-600 bg-red-100', text: 'หมด' };
    } else if (stock < 10) {
      return { color: 'text-yellow-600 bg-yellow-100', text: 'น้อย' };
    } else {
      return { color: 'text-green-600 bg-green-100', text: 'พร้อม' };
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
  };

  // Remove uploaded image
  const removeImage = (index: number, isUrl: boolean = false) => {
    if (isUrl) {
      setFormData(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'ไม่ระบุ';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Package size={48} className="text-gray-300" />
        <div className="text-center">
          <p className="text-gray-500 mb-2">{error}</p>
          <p className="text-sm text-gray-400">กรุณาตรวจสอบการเชื่อมต่อ API หรือข้อมูล Console สำหรับรายละเอียดเพิ่มเติม</p>
        </div>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      {error && products.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              ⚠️
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
          <p className="text-gray-600">จัดการรายการสินค้าในร้านค้า</p>
          <p className="text-sm text-gray-500">
            พบสินค้า {products.length} รายการ
            {loading && ' (กำลังโหลด...)'}
            {pagination.totalProducts > 0 && ` (ทั้งหมด ${pagination.totalProducts} รายการ)`}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>เพิ่มสินค้าใหม่</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">หมวดหมู่ทั้งหมด</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div> */}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">สินค้า</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">หมวดหมู่</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">ราคา</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">คลังสินค้า</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">สถานะ</th>
                <th className="text-right py-3 px-6 font-medium text-gray-900">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    <Package size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>ไม่พบสินค้า</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stockQuantity = product.inventory?.quantity ?? product.stock ?? 0;
                  const stockStatus = getStockStatus(stockQuantity);
                  const firstImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                            {firstImage ? (
                              <img 
                                src={firstImage} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package size={20} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {getCategoryName(product.categoryId || '')}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium">{stockQuantity}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-1 text-gray-600 hover:text-blue-600 rounded"
                            title="แก้ไข"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1 text-gray-600 hover:text-red-600 rounded"
                            title="ลบ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              แสดง {(pagination.currentPage - 1) * pagination.limit + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)} จาก {pagination.totalProducts} รายการ
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage || loading}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg ${
                      pageNum === pagination.currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage || loading}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Error message */}
              {formErrors.general && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {formErrors.general}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อสินค้า *
                </label>
                <input
                  type="text"
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รายละเอียด *
                </label>
                <textarea
                  required
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ราคา (บาท) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    จำนวนในคลัง *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.quantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                  {formErrors.quantity && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>
                  )}
                </div>
              </div>



              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รูปภาพสินค้า
                </label>
                <div className="space-y-3">
                  {/* Upload button */}
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 flex items-center space-x-2">
                      <Upload size={16} />
                      <span>อัปโหลดรูปภาพ</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <span className="text-sm text-gray-500">ไฟล์ขนาดไม่เกิน 5MB</span>
                  </div>

                  {/* Existing images */}
                  {formData.imageUrls.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">รูปภาพปัจจุบัน:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {formData.imageUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`รูปภาพ ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, true)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New uploaded images */}
                  {formData.images.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">รูปภาพใหม่ (ยังไม่ได้บันทึก):</p>
                      <div className="grid grid-cols-4 gap-2">
                        {formData.images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`ใหม่ ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border border-blue-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, false)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>


              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>กำลังบันทึก...</span>
                    </div>
                  ) : (
                    editingProduct ? 'บันทึก' : 'เพิ่มสินค้า'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;