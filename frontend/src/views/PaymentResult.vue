
<template>
  <div class="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
    <div v-if="loading" class="flex flex-col items-center">
       <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
       <p class="mt-4 text-gray-500">Đang xác thực giao dịch...</p>
    </div>

    <div v-else-if="success" class="text-center">
       <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
         </svg>
       </div>
       <h2 class="text-3xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
       <p class="text-gray-600 mb-8">Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được xác nhận.</p>
       <div class="space-x-4">
         <router-link to="/orders" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Xem đơn hàng
         </router-link>
         <router-link to="/" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Tiếp tục mua sắm
         </router-link>
       </div>
    </div>

    <div v-else class="text-center">
       <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
         </svg>
       </div>
       <h2 class="text-3xl font-bold text-gray-800 mb-2">Thanh toán thất bại</h2>
       <p class="text-gray-600 mb-8">{{ message || 'Có lỗi xảy ra trong quá trình thanh toán.' }}</p>
       <div class="space-x-4">
         <router-link to="/checkout" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Thử lại
         </router-link>
         <router-link to="/" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Về trang chủ
         </router-link>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const loading = ref(true);
const success = ref(false);
const message = ref('');

const API_URL = import.meta.env.VITE_API_URL;

onMounted(async () => {
  // Lấy danh sách tham số từ URL do VNPay trả về
  const query = route.query;
  
  if (!query.vnp_SecureHash) {
    loading.value = false;
    success.value = false;
    message.value = 'Thông tin giao dịch không hợp lệ';
    return;
  }

  try {
    // Gọi API backend để kiểm tra checksum (bảo mật)
    const queryString = new URLSearchParams(query).toString();
    const res = await fetch(`${API_URL}/payment/vnpay_return?${queryString}`);
    const data = await res.json();
    
    if (data.code === '00') {
      success.value = true;
      // Xóa giỏ hàng nếu thanh toán thành công
      cartStore.removePurchasedItems(); 
    } else {
        success.value = false;
        message.value = 'Giao dịch bị hủy hoặc lỗi từ ngân hàng.';
    }
  } catch (error) {
    console.error(error);
    success.value = false;
    message.value = 'Lỗi kết nối đến hệ thống.';
  } finally {
    loading.value = false;
  }
});
</script>
