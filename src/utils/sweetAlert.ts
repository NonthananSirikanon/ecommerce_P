import Swal from 'sweetalert2';

// Configure default styles that work well with Tailwind CSS
const defaultConfig = {
  customClass: {
    popup: 'rounded-lg shadow-xl',
    title: 'text-gray-900 font-semibold',
    content: 'text-gray-600',
    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors',
    cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors mr-3',
  },
  buttonsStyling: false,
};

export class SweetAlertUtils {
  /**
   * Show a success message
   */
  static success(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      ...defaultConfig,
      customClass: {
        ...defaultConfig.customClass,
        confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors',
      },
    });
  }

  /**
   * Show an error message
   */
  static error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      ...defaultConfig,
      customClass: {
        ...defaultConfig.customClass,
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors',
      },
    });
  }

  /**
   * Show a warning message
   */
  static warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      ...defaultConfig,
      customClass: {
        ...defaultConfig.customClass,
        confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors',
      },
    });
  }

  /**
   * Show an info message
   */
  static info(title: string, text?: string) {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      ...defaultConfig,
    });
  }

  /**
   * Show a confirmation dialog
   */
  static confirm(
    title: string, 
    text?: string, 
    confirmButtonText: string = 'ยืนยัน',
    cancelButtonText: string = 'ยกเลิก'
  ) {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      ...defaultConfig,
    });
  }

  /**
   * Show a delete confirmation dialog
   */
  static confirmDelete(
    title: string = 'คุณแน่ใจหรือไม่?',
    text: string = 'การกระทำนี้ไม่สามารถยกเลิกได้!',
    confirmButtonText: string = 'ลบ',
    cancelButtonText: string = 'ยกเลิก'
  ) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      ...defaultConfig,
      customClass: {
        ...defaultConfig.customClass,
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors',
      },
    });
  }

  /**
   * Show a loading dialog
   */
  static loading(title: string = 'กำลังประมวลผล...', text?: string) {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      ...defaultConfig,
    });
  }

  /**
   * Close any open SweetAlert dialog
   */
  static close() {
    Swal.close();
  }

  /**
   * Show a toast notification
   */
  static toast(
    icon: 'success' | 'error' | 'warning' | 'info',
    title: string,
    timer: number = 3000
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
      customClass: {
        popup: 'rounded-lg shadow-lg',
      },
    });

    return Toast.fire({
      icon,
      title,
    });
  }

  /**
   * Show an input dialog
   */
  static input(
    title: string,
    inputPlaceholder: string = '',
    inputType: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text',
    confirmButtonText: string = 'ยืนยัน',
    cancelButtonText: string = 'ยกเลิก'
  ) {
    return Swal.fire({
      title,
      input: inputType,
      inputPlaceholder,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      inputValidator: (value) => {
        if (!value) {
          return 'กรุณากรอกข้อมูล!';
        }
        return null;
      },
      ...defaultConfig,
    });
  }

  /**
   * Cart-specific alerts with Thai messages
   */
  static cart = {
    addSuccess: (productName: string) =>
      this.toast('success', `เพิ่ม "${productName}" ลงตะกร้าแล้ว`),

    addError: (error?: string) =>
      this.error('ไม่สามารถเพิ่มสินค้าได้', error || 'กรุณาลองใหม่อีกครั้ง'),

    removeConfirm: (productName: string) =>
      this.confirm(
        'ลบสินค้าออกจากตะกร้า?',
        `คุณต้องการลบ "${productName}" ออกจากตะกร้าหรือไม่?`,
        'ลบ',
        'ยกเลิก'
      ),

    clearConfirm: () =>
      this.confirmDelete(
        'ล้างตะกร้าสินค้า?',
        'คุณต้องการลบสินค้าทั้งหมดออกจากตะกร้าหรือไม่?',
        'ล้างทั้งหมด',
        'ยกเลิก'
      ),

    updateSuccess: () =>
      this.toast('success', 'อัปเดตจำนวนสินค้าแล้ว'),

    updateError: (error?: string) =>
      this.error('ไม่สามารถอัปเดตจำนวนได้', error || 'กรุณาลองใหม่อีกครั้ง'),
  };

  /**
   * Auth-specific alerts with Thai messages
   */
  static auth = {
    loginSuccess: (userName: string) =>
      this.toast('success', `ยินดีต้อนรับ ${userName}!`),

    loginError: (error?: string) =>
      this.error('เข้าสู่ระบบไม่สำเร็จ', error || 'กรุณาตรวจสอบอีเมลและรหัสผ่าน'),

    registerSuccess: () =>
      this.success('สมัครสมาชิกสำเร็จ', 'ยินดีต้อนรับเข้าสู่ระบบ!'),

    registerError: (error?: string) =>
      this.error('สมัครสมาชิกไม่สำเร็จ', error || 'กรุณาตรวจสอบข้อมูลและลองใหม่'),

    logoutConfirm: () =>
      this.confirm('ออกจากระบบ?', 'คุณต้องการออกจากระบบหรือไม่?', 'ออกจากระบบ', 'ยกเลิก'),

    logoutSuccess: () =>
      this.toast('success', 'ออกจากระบบแล้ว'),
  };

  /**
   * Order-specific alerts with Thai messages
   */
  static order = {
    confirmCheckout: (total: string) =>
      this.confirm(
        'ยืนยันการสั่งซื้อ?',
        `ยอดรวม: ${total}\nคุณต้องการดำเนินการชำระเงินหรือไม่?`,
        'ดำเนินการชำระเงิน',
        'ยกเลิก'
      ),

    checkoutSuccess: () =>
      this.success('สั่งซื้อสำเร็จ!', 'ขอบคุณสำหรับการสั่งซื้อ'),

    checkoutError: (error?: string) =>
      this.error('ไม่สามารถสั่งซื้อได้', error || 'กรุณาลองใหม่อีกครั้ง'),
  };
}

// Export default instance for convenience
export default SweetAlertUtils;