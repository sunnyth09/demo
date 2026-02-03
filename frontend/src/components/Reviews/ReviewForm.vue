<template>
  <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      Viết đánh giá của bạn
    </h3>
    
    <div v-if="!authStore.isAuthenticated" class="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
      </div>
      <h4 class="text-lg font-bold text-gray-900 mb-2">Bạn chưa đăng nhập?</h4>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">Vui lòng đăng nhập để chia sẻ đánh giá của bạn về sản phẩm này.</p>
      <router-link 
        to="/login" 
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
      >
        Đăng nhập ngay
      </router-link>
    </div>

    <div v-else-if="hasReviewed" class="text-center py-12 bg-green-50 rounded-2xl border border-green-100">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h4 class="text-lg font-bold text-green-800 mb-2">Cảm ơn bạn đã đánh giá!</h4>
      <p class="text-green-600">Bạn đã gửi đánh giá cho sản phẩm này.</p>
    </div>

    <div v-else>
      <form @submit.prevent="submitReview" class="space-y-6">
        <!-- User Info & Rating -->
        <div class="flex items-start gap-4">
           <!-- Avatar -->
           <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg hidden md:flex shrink-0">
              {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
           </div>

           <div class="flex-1 space-y-4">
              <!-- Rating Input -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Bạn cảm thấy sản phẩm thế nào?</label>
                <div class="flex items-center gap-4">
                  <div class="flex gap-2">
                    <button 
                      type="button" 
                      v-for="star in 5" 
                      :key="star" 
                      @click="rating = star"
                      @mouseenter="hoverRating = star"
                      @mouseleave="hoverRating = 0"
                      class="text-3xl focus:outline-none transition-all duration-200 transform hover:scale-110"
                      :class="(hoverRating || rating) >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'"
                    >
                      ★
                    </button>
                  </div>
                  <span v-if="hoverRating || rating" class="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-full animate-fade-in">
                    {{ getRatingText(hoverRating || rating) }}
                  </span>
                </div>
                <p v-if="errors.rating" class="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.rating }}
                </p>
              </div>

              <!-- Comment Input -->
              <div class="relative">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nội dung đánh giá</label>
                <textarea 
                  v-model="comment" 
                  rows="4" 
                  class="w-full border-gray-200 rounded-xl shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-4 transition-all resize-none text-gray-700 bg-gray-50 focus:bg-white"
                  placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm, chất lượng, dịch vụ..."
                  required
                ></textarea>
                <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                  {{ comment.length }} ký tự
                </div>
              </div>
           </div>
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
           {{ error }}
        </div>

        <div class="flex justify-end pt-2 border-t border-gray-50">
          <button 
            type="submit" 
            class="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed font-semibold shadow-lg shadow-primary/30 flex items-center gap-2"
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else>Gửi đánh giá</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['review-submitted']);

const authStore = useAuthStore();
const route = useRoute();
const API_URL = import.meta.env.VITE_API_URL;

const rating = ref(0);
const hoverRating = ref(0);
const comment = ref('');
const loading = ref(false);
const error = ref('');
const hasReviewed = ref(false); // New state

const errors = reactive({
  rating: ''
});

// Check if user already reviewed
const checkReviewed = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    // This is a bit inefficient (getting all reviews), but works for now. 
    // Ideally we should have an endpoint /api/reviews/me/product/:id
    const res = await fetch(`${API_URL}/reviews/product/${props.productId}`);
    const json = await res.json();
    if (res.ok && json.data) {
      const myReview = json.data.find(r => r.user_id === authStore.user.id);
      if (myReview) {
        hasReviewed.value = true;
      } else {
        hasReviewed.value = false;
      }
    }
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => {
  checkReviewed();
});

watch(() => props.productId, () => {
  rating.value = 0;
  comment.value = '';
  hasReviewed.value = false;
  checkReviewed();
});

const getRatingText = (star) => {
  const texts = {
    1: 'Rất tệ',
    2: 'Tệ',
    3: 'Bình thường',
    4: 'Tốt',
    5: 'Tuyệt vời'
  };
  return texts[star] || '';
};

const submitReview = async () => {
  // Validate
  errors.rating = '';
  error.value = '';
  
  if (rating.value === 0) {
    errors.rating = 'Vui lòng chọn số sao đánh giá';
    return;
  }

  loading.value = true;

  try {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: props.productId,
        rating: rating.value,
        comment: comment.value
      })
    });

    const data = await res.json();

    if (res.ok) {
      // Reset form
      rating.value = 0;
      comment.value = '';
      hasReviewed.value = true; // Mark as reviewed
      emit('review-submitted');
      alert('Cảm ơn bạn đã đánh giá!');
    } else {
      error.value = data.message || 'Có lỗi xảy ra, vui lòng thử lại';
    }
  } catch (err) {
    console.error('Submit review error:', err);
    error.value = 'Lỗi kết nối server';
  } finally {
    loading.value = false;
  }
};
</script>
