<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
    <div class="w-full max-w-md">
      <div class="bg-card rounded-2xl border shadow-lg p-8">
        <!-- Back Button -->
        <router-link to="/login" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Quay lại đăng nhập
        </router-link>

        <!-- Step 1: Request OTP -->
        <div v-if="step === 1">
          <div class="text-center mb-6">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold">Quên mật khẩu?</h1>
            <p class="text-muted-foreground mt-2">Nhập email của bạn để nhận mã xác thực.</p>
          </div>

          <form @submit.prevent="handleSendOtp" class="space-y-4">
             <!-- Error Message -->
            <div v-if="errorMessage" class="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ errorMessage }}
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input 
                v-model="email" 
                type="email" 
                required 
                class="w-full h-11 px-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors" 
                placeholder="your@gmail.com" 
              />
            </div>

            <button 
              type="submit" 
              :disabled="loading" 
              class="w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Đang gửi...' : 'Gửi mã xác thực' }}
            </button>
          </form>
        </div>

        <!-- Step 2: Verify OTP & Reset Password -->
        <div v-if="step === 2">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold">Đặt lại mật khẩu</h1>
            <p class="text-muted-foreground mt-2">Mã OTP đã được gửi đến <span class="font-medium text-foreground">{{ email }}</span></p>
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-4">
             <div v-if="errorMessage" class="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ errorMessage }}
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Mã OTP</label>
              <input 
                v-model="otp" 
                type="text" 
                required 
                class="w-full h-11 px-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors text-center tracking-widest text-lg" 
                placeholder="123456" 
                maxlength="6"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Mật khẩu mới</label>
              <input 
                v-model="newPassword" 
                type="password" 
                required 
                class="w-full h-11 px-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors" 
                placeholder="••••••••" 
              />
            </div>

             <div>
              <label class="block text-sm font-medium mb-2">Xác nhận mật khẩu</label>
              <input 
                v-model="confirmPassword" 
                type="password" 
                required 
                class="w-full h-11 px-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              :disabled="loading" 
              class="w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
            </button>

             <button type="button" @click="step = 1" class="w-full text-sm text-muted-foreground hover:underline mt-2 text-center block">Nhập sai email? Gửi lại</button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const step = ref(1);
const email = ref('');
const otp = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleSendOtp = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    // console.log('Sending OTP to', email.value);
    await authStore.forgotPassword(email.value);
    step.value = 2;
  } catch (err) {
    if (err.response && err.response.data) {
        errorMessage.value = err.response.data.message;
    } else {
        errorMessage.value = err.message || 'Có lỗi xảy ra.';
    }
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'Mật khẩu xác nhận không khớp';
        return;
    }

  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.resetPassword({
        email: email.value,
        otp: otp.value,
        newPassword: newPassword.value
    });
    alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
    router.push('/login');
  } catch (err) {
     if (err.response && err.response.data) {
        errorMessage.value = err.response.data.message;
    } else {
        errorMessage.value = err.message || 'Có lỗi xảy ra.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
