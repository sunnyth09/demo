<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <div class="bg-card rounded-2xl border shadow-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold">Tạo tài khoản</h1>
          <p class="text-muted-foreground mt-2">Bắt đầu hành trình khám phá tri thức</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Error Message -->
          <Alert v-if="errorMessage" variant="destructive">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>
              {{ errorMessage }}
            </AlertDescription>
          </Alert>
          
          <!-- Success Message -->
          <div v-if="successMessage" class="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
            {{ successMessage }}
          </div>

          <!-- Name Field -->
          <div>
            <label class="block text-sm font-medium mb-2">Họ và tên</label>
            <input 
              v-model="form.name"
              type="text" 
              placeholder="Nguyễn Văn A"
              class="w-full h-11 px-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              :class="errors.name ? 'border-destructive' : 'border-input'"
              :disabled="loading"
              @input="clearError('name')"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-destructive">{{ errors.name }}</p>
          </div>

          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input 
              v-model="form.email"
              type="email" 
              placeholder="your@email.com"
              class="w-full h-11 px-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              :class="errors.email ? 'border-destructive' : 'border-input'"
              :disabled="loading"
              @input="clearError('email')"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-destructive">{{ errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-medium mb-2">Mật khẩu</label>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'" 
                placeholder="Tối thiểu 6 ký tự"
                class="w-full h-11 px-4 pr-10 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                :class="errors.password ? 'border-destructive' : 'border-input'"
                :disabled="loading"
                @input="clearError('password')"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-destructive">{{ errors.password }}</p>
            <!-- Password strength indicator -->
            <div v-if="form.password" class="mt-2">
              <div class="flex gap-1">
                <div class="h-1 flex-1 rounded-full" :class="passwordStrength >= 1 ? 'bg-red-500' : 'bg-muted'"></div>
                <div class="h-1 flex-1 rounded-full" :class="passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-muted'"></div>
                <div class="h-1 flex-1 rounded-full" :class="passwordStrength >= 3 ? 'bg-green-500' : 'bg-muted'"></div>
              </div>
              <p class="text-xs mt-1" :class="passwordStrengthColor">{{ passwordStrengthText }}</p>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label class="block text-sm font-medium mb-2">Xác nhận mật khẩu</label>
            <div class="relative">
              <input 
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" 
                placeholder="Nhập lại mật khẩu"
                class="w-full h-11 px-4 pr-10 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                :class="errors.confirmPassword ? 'border-destructive' : 'border-input'"
                :disabled="loading"
                @input="clearError('confirmPassword')"
              />
              <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-destructive">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Terms Checkbox -->
          <div>
            <div class="flex items-start gap-2">
              <input 
                v-model="form.agreeTerms"
                type="checkbox" 
                id="agreeTerms"
                class="mt-1 rounded border-input" 
                :disabled="loading"
                @change="clearError('agreeTerms')" 
              />
              <label for="agreeTerms" class="text-sm text-muted-foreground cursor-pointer">
                Tôi đồng ý với <a href="#" class="text-primary hover:underline">Điều khoản dịch vụ</a> và <a href="#" class="text-primary hover:underline">Chính sách bảo mật</a>
              </label>
            </div>
            <p v-if="errors.agreeTerms" class="mt-1 text-sm text-destructive">{{ errors.agreeTerms }}</p>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
          </button>
        </form>

        <!-- Login Link -->
        <p class="text-center mt-6 text-sm text-muted-foreground">
          Đã có tài khoản? 
          <router-link to="/login" class="text-primary font-medium hover:underline">
            Đăng nhập
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Email regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 6) strength++
  if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) strength++
  if (password.length >= 10 && /[!@#$%^&*]/.test(password)) strength++
  
  return strength
})

const passwordStrengthText = computed(() => {
  const texts = ['', 'Yếu', 'Trung bình', 'Mạnh']
  return texts[passwordStrength.value]
})

const passwordStrengthColor = computed(() => {
  const colors = ['', 'text-red-500', 'text-yellow-500', 'text-green-500']
  return colors[passwordStrength.value]
})

// Form validity check
const isFormValid = computed(() => {
  return form.name && form.email && form.password && form.confirmPassword && form.agreeTerms &&
         !errors.name && !errors.email && !errors.password && !errors.confirmPassword && !errors.agreeTerms
})

// Validation functions
const validateName = () => {
  if (!form.name.trim()) {
    errors.name = 'Vui lòng nhập họ và tên'
  } else if (form.name.trim().length < 2) {
    errors.name = 'Họ và tên phải có ít nhất 2 ký tự'
  } else {
    errors.name = ''
  }
}

const validateEmail = () => {
  if (!form.email.trim()) {
    errors.email = 'Vui lòng nhập email'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Email không hợp lệ'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Vui lòng nhập mật khẩu'
  } else if (form.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
  } else {
    errors.password = ''
  }
  // Also validate confirm password if it has value
  if (form.confirmPassword) {
    validateConfirmPassword()
  }
}

const validateConfirmPassword = () => {
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
  } else {
    errors.confirmPassword = ''
  }
}

const validateTerms = () => {
  if (!form.agreeTerms) {
    errors.agreeTerms = 'Bạn phải đồng ý với điều khoản dịch vụ'
  } else {
    errors.agreeTerms = ''
  }
}

const clearError = (field) => {
  errors[field] = ''
}

// Validate all fields
const validateAll = () => {
  validateName()
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  validateTerms()
  
  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword && !errors.agreeTerms
}

const handleRegister = async () => {
  if (loading.value) return
  
  // Validate all fields
  if (!validateAll()) {
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password
    })
    
    successMessage.value = 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...'
    
    // Chuyển đến trang đăng nhập sau 2 giây
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
</script>
